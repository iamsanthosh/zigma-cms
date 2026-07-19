import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';
import { getSessionUser } from '@/lib/auth';
import { query } from '@/lib/db';

// NOTE ON HOSTINGER DEPLOYMENT:
// This route writes uploaded files straight into /public/uploads on disk,
// which works out of the box on Hostinger's Node.js hosting (files are
// served directly by Next.js, and the 50GB NVMe plan easily covers a
// marketing site's media library). If you outgrow local storage or want a
// dedicated CDN in front of media, replace the two `write to disk` lines
// below with an upload call to your storage provider's SDK and set
// MEDIA_BASE_URL accordingly — nothing else in the app needs to change,
// since every consumer only ever reads `media_assets.url`.

export async function POST(req) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get('file');
  const folder = (formData.get('folder') || 'general').toString().replace(/[^a-z0-9-_]/gi, '');
  const altText = formData.get('alt_text')?.toString() || null;

  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name || '').toLowerCase() || '.bin';
  const filename = `${nanoid(12)}${ext}`;
  const type = (file.type || '').startsWith('video') ? 'video' : 'image';

  const dir = path.join(process.cwd(), 'public', 'uploads', folder);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), bytes);

  const url = `${process.env.MEDIA_BASE_URL || '/uploads'}/${folder}/${filename}`;

  const result = await query(
    `INSERT INTO media_assets (type, url, alt_text, file_size, folder, uploaded_by) VALUES (?, ?, ?, ?, ?, ?)`,
    [type, url, altText, bytes.length, folder, user.sub]
  );

  const [asset] = await query(`SELECT * FROM media_assets WHERE id = ?`, [result.insertId]);
  return NextResponse.json(asset, { status: 201 });
}
