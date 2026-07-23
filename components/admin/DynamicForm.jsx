'use client';
import MediaPicker from './MediaPicker';

function setPath(obj, name, value) {
  return { ...obj, [name]: value };
}

/**
 * Renders one field per schema entry. `value`/`onChange` operate on the
 * whole `data` object for the section; each field reads/writes its own key.
 * Repeater fields recurse into RepeaterField below, which is how a single
 * generic form covers slides, bullets, stats, milestones, testimonials,
 * industries, social links, etc. — every "list of things" a section needs.
 */
export default function DynamicForm({ schema, value, onChange }) {
  const data = value || {};

  function update(name, val) {
    onChange(setPath(data, name, val));
  }

  return (
    <div>
      {schema.fields.map((field) => (
        <FieldInput key={field.name} field={field} value={data[field.name]} onChange={(v) => update(field.name, v)} />
      ))}
    </div>
  );
}

function FieldInput({ field, value, onChange }) {
  switch (field.type) {
    case 'text':
    case 'url':
      return (
        <div className="admin-field">
          <label>{field.label}</label>
          <input type={field.type === 'url' ? 'url' : 'text'} value={value || ''} onChange={(e) => onChange(e.target.value)} />
        </div>
      );
    case 'number':
      return (
        <div className="admin-field">
          <label>{field.label}</label>
          <input type="number" value={value ?? ''} onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))} />
        </div>
      );
    case 'textarea':
    case 'richtext':
      return (
        <div className="admin-field">
          <label>{field.label}</label>
          <textarea value={value || ''} onChange={(e) => onChange(e.target.value)} />
          {field.type === 'richtext' && (
            <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginTop: '0.25rem' }}>
              HTML is allowed and rendered as-is on the public site.
            </p>
          )}
        </div>
      );
    case 'boolean':
      return (
        <div className="admin-field">
          <label>
            <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} style={{ width: 'auto', marginRight: '0.5rem' }} />
            {field.label}
          </label>
        </div>
      );
    case 'color':
      return (
        <div className="admin-field">
          <label>{field.label}</label>
          <input type="color" value={value || '#FF6B1A'} onChange={(e) => onChange(e.target.value)} style={{ width: 80 }} />
        </div>
      );
    case 'select':
      return (
        <div className="admin-field">
          <label>{field.label}</label>
          <select value={value || ''} onChange={(e) => onChange(e.target.value)}>
            <option value="">-- Select --</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {field.help && <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginTop: '0.25rem' }}>{field.help}</p>}
        </div>
      );
    case 'image':
      return (
        <div className="admin-field">
          <label>{field.label}</label>
          <MediaPicker value={value} onChange={onChange} accept="image" />
        </div>
      );
    case 'video':
      return (
        <div className="admin-field">
          <label>{field.label}</label>
          <MediaPicker value={value} onChange={onChange} accept="video" />
        </div>
      );
    case 'repeater':
      return (
        <div className="admin-field">
          <label>{field.label}</label>
          <RepeaterField fields={field.fields} value={value || []} onChange={onChange} />
        </div>
      );
    default:
      return null;
  }
}

function RepeaterField({ fields, value, onChange }) {
  function updateItem(index, itemValue) {
    const next = [...value];
    next[index] = itemValue;
    onChange(next);
  }

  function addItem() {
    onChange([...value, {}]);
  }

  function removeItem(index) {
    onChange(value.filter((_, i) => i !== index));
  }

  function duplicateItem(index) {
    const next = [...value];
    const itemToDuplicate = next[index];
    const duplicatedItem = { ...itemToDuplicate };
    next.splice(index + 1, 0, duplicatedItem);
    onChange(next);
  }

  function move(index, dir) {
    const target = index + dir;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div>
      {value.map((item, i) => (
        <div className="admin-repeater-item" key={i} style={item.active === false ? { opacity: 0.5 } : undefined}>
          <div className="admin-repeater-item-head">
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#5B6472' }}>#{i + 1}</span>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button type="button" className="admin-btn admin-btn-ghost" onClick={() => move(i, -1)}>↑</button>
              <button type="button" className="admin-btn admin-btn-ghost" onClick={() => move(i, 1)}>↓</button>
              <button
                type="button"
                className="admin-btn admin-btn-ghost"
                onClick={() => updateItem(i, { ...item, active: item.active === false ? true : false })}
              >
                {item.active === false ? 'Show' : 'Hide'}
              </button>
              <button type="button" className="admin-btn admin-btn-ghost" onClick={() => duplicateItem(i)}>Duplicate</button>
              <button type="button" className="admin-btn admin-btn-danger" onClick={() => removeItem(i)}>Remove</button>
            </div>
          </div>
          {fields.map((f) => (
            <FieldInput
              key={f.name}
              field={f}
              value={item[f.name]}
              onChange={(v) => updateItem(i, { ...item, [f.name]: v })}
            />
          ))}
        </div>
      ))}
      <button type="button" className="admin-btn admin-btn-primary" onClick={addItem}>
        + Add
      </button>
    </div>
  );
}
