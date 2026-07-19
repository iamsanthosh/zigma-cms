export default function RichText({ data, backgroundStyle }) {
  return (
    <section className={`section section-${backgroundStyle || 'light'}`}>
      <div className="container">
        <div dangerouslySetInnerHTML={{ __html: data.body || '' }} />
      </div>
    </section>
  );
}
