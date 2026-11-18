import { randomBytes } from 'crypto';
import { encode } from 'uqr';

/**
 * The pure rules of a registration: what a seat costs today, how old a participant is on event day, which answers are kept and how
 * they are stored, and the QR code. No database or HTTP in here, so every rule is unit tested (registrations.logic.spec.ts).
 */

/* ------------------------------------------------------------------ */
/* Dates                                                               */
/* ------------------------------------------------------------------ */

/** Today's date in India (YYYY-MM-DD): price windows and registration dates are IST days. */
export function istToday(now: Date = new Date()): string {
  return new Date(now.getTime() + 5.5 * 3600 * 1000).toISOString().slice(0, 10);
}

/** Whole years between a birth date and a day (both YYYY-MM-DD). */
export function ageOn(birthDate: string, on: string): number {
  const [by, bm, bd] = birthDate.split('-').map(Number);
  const [oy, om, od] = on.split('-').map(Number);
  let age = oy - by;
  if (om < bm || (om === bm && od < bd)) age -= 1;
  return age;
}

export const isIsoDate = (v: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const d = new Date(`${v}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
};

/* ------------------------------------------------------------------ */
/* Pricing                                                             */
/* ------------------------------------------------------------------ */

export interface PriceTierRow {
  id: string;
  label: string;
  price_inr: number;
  valid_from: string | null;
  valid_until: string | null;
}
export interface CategoryRow {
  id: string;
  label: string;
  gender: string;
  capacity: number | null;
  slots_taken: number | null;
  price_inr: number | null;
  min_age: number | null;
  max_age: number | null;
  event_price_tiers?: PriceTierRow[] | null;
}

/** The price a seat costs on `today`: the tier whose window holds today (earliest start first), else the category's own price. */
export function unitPrice(
  cat: CategoryRow,
  today: string,
): { price: number; tierId: string | null } | null {
  const tiers = [...(cat.event_price_tiers ?? [])].sort((a, b) =>
    (a.valid_from ?? '').localeCompare(b.valid_from ?? ''),
  );
  const hit = tiers.find(
    (t) =>
      (!t.valid_from || t.valid_from <= today) &&
      (!t.valid_until || today <= t.valid_until),
  );
  if (hit) return { price: hit.price_inr, tierId: hit.id };
  if (cat.price_inr !== null && cat.price_inr !== undefined)
    return { price: cat.price_inr, tierId: null };
  return null;
}

export function orderTotals(
  prices: number[],
  taxMode: string | null,
  gstRate: number | null,
) {
  const subtotal = prices.reduce((n, p) => n + p, 0);
  const tax =
    taxMode === 'exclusive' && gstRate
      ? Math.round((subtotal * gstRate) / 100)
      : 0;
  return {
    subtotal_inr: subtotal,
    tax_inr: tax,
    fee_inr: 0,
    discount_inr: 0,
    total_inr: subtotal + tax,
  };
}

/* ------------------------------------------------------------------ */
/* Answers: the organiser's questions, saved the way they were asked   */
/* ------------------------------------------------------------------ */

export interface FormFieldRow {
  id: string;
  category_id: string | null;
  field_key: string;
  label: string;
  field_type: string;
  options: unknown;
  is_required: boolean;
}

export interface AnswerRow {
  field_id: string | null;
  field_key: string;
  field_label: string;
  field_type: string;
  value_text: string | null;
  value_json: unknown;
  is_sensitive: boolean;
}

interface Meta {
  label: string;
  type: string;
}

/**
 * Questions the checkout asks that are not rows in event_form_fields: the sport presets, and the ones a ticket implies (a doubles
 * partner, a qualifying time, a T-shirt, a guardian for a minor). They are kept under the same keys, with fixed labels and types.
 * An event's own event_form_fields rows always take precedence over these.
 */
export const BUILT_IN_FIELDS: Record<string, Meta> = {
  whatsapp: { label: 'WhatsApp number', type: 'phone' },
  address_line: { label: 'Address', type: 'text' },
  city: { label: 'City', type: 'text' },
  state: { label: 'State', type: 'select' },
  pincode: { label: 'Pincode', type: 'text' },
  name_on_bib: { label: 'Name on bib', type: 'text' },
  club: { label: 'Club or group', type: 'club' },
  best_time: { label: 'Best time at this distance', type: 'text' },
  emergency_contact: { label: 'Emergency contact', type: 'emergency_contact' },
  blood_group: { label: 'Blood group', type: 'blood_group' },
  medical_conditions: {
    label: 'Medical conditions or allergies',
    type: 'textarea',
  },
  bike_type: { label: 'Bike', type: 'select' },
  rider_id: { label: 'Rider ID', type: 'text' },
  helmet_ack: { label: 'Helmet acknowledgement', type: 'checkbox' },
  experience: { label: 'Experience', type: 'select' },
  diet: { label: 'Food preference', type: 'select' },
  fitness_certificate: { label: 'Medical fitness certificate', type: 'file' },
  swim_level: { label: 'Swimming ability', type: 'select' },
  playing_level: { label: 'Playing level', type: 'select' },
  federation_id: { label: 'Federation player ID', type: 'text' },
  partner_name: { label: "Doubles partner's name", type: 'text' },
  partner_phone: { label: "Partner's mobile", type: 'phone' },
  qualifying_result: { label: 'Qualifying race and time', type: 'text' },
  timing_certificate: { label: 'Timing certificate', type: 'file' },
  tshirt_size: { label: 'T-shirt size', type: 'tshirt_size' },
  guardian_name: { label: "Parent or guardian's name", type: 'text' },
  guardian_phone: { label: "Parent or guardian's mobile", type: 'phone' },
  guardian_consent: { label: 'Guardian consent', type: 'checkbox' },
};

const SENSITIVE_KEY = /^(medical|allerg|health|condition|disab|injur)/;
/** Medical and emergency answers: stored flagged, so only the organiser team sees them and broad exports can leave them out. */
export const isSensitive = (key: string, type: string): boolean =>
  type === 'blood_group' ||
  type === 'emergency_contact' ||
  SENSITIVE_KEY.test(key);

const MAX_TEXT = 600;
const MAX_ANSWERS = 60;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phoneOk = (v: string) =>
  /^[6-9]\d{9}$/.test(v.replace(/[\s-]/g, '').replace(/^(\+91|0)/, ''));

type Stored = { text: string | null; json: unknown } | { error: string };

/** One value, checked against its field type, as the pair (searchable text, structured json). */
function store(
  label: string,
  type: string,
  options: unknown,
  v: unknown,
): Stored {
  const opts = Array.isArray(options)
    ? options.filter((o): o is string => typeof o === 'string')
    : null;
  const bad = (m: string): Stored => ({ error: `${label}: ${m}` });
  const str = (x: unknown) => (typeof x === 'string' ? x.trim() : null);

  switch (type) {
    case 'checkbox':
      return typeof v === 'boolean'
        ? { text: v ? 'yes' : 'no', json: v }
        : bad('must be true or false');
    case 'multiselect': {
      if (!Array.isArray(v) || v.some((x) => typeof x !== 'string'))
        return bad('must be a list');
      if (opts?.length && v.some((x) => !opts.includes(x as string)))
        return bad('has an option that is not offered');
      return { text: (v as string[]).join(', ').slice(0, MAX_TEXT), json: v };
    }
    case 'emergency_contact': {
      const c = v as {
        name?: unknown;
        phone?: unknown;
        relation?: unknown;
      } | null;
      const name = str(c?.name);
      const phone = str(c?.phone);
      if (!name || name.length < 2) return bad('needs a name');
      if (!phone || !phoneOk(phone))
        return bad('needs a 10-digit mobile number');
      const relation = str(c?.relation) ?? '';
      return {
        text: `${name} ${phone} ${relation}`.trim().slice(0, MAX_TEXT),
        json: { name, phone, relation },
      };
    }
    default: {
      const s = typeof v === 'number' && type === 'number' ? String(v) : str(v);
      if (s === null) return bad('must be text');
      if (s.length > MAX_TEXT)
        return bad(`is too long (${MAX_TEXT} characters at most)`);
      if (type === 'phone' && s && !phoneOk(s))
        return bad('needs a 10-digit mobile number');
      if (type === 'email' && s && !EMAIL.test(s))
        return bad('needs a valid email');
      if (type === 'number' && s && !Number.isFinite(Number(s)))
        return bad('must be a number');
      if (type === 'date' && s && !isIsoDate(s))
        return bad('must be a date (YYYY-MM-DD)');
      if (
        (type === 'select' ||
          type === 'tshirt_size' ||
          type === 'blood_group') &&
        s &&
        opts?.length &&
        !opts.includes(s)
      )
        return bad('is not one of the options');
      return { text: s || null, json: type === 'number' && s ? Number(s) : s };
    }
  }
}

/**
 * Turn what the participant answered into rows for registration_answers.
 *  - An event with its own questions (event_form_fields): those that apply to this ticket's category are required or optional as the
 *    organiser set them, validated by their type and options, and saved with the organiser's label so a later rename never rewrites history.
 *  - Built-in questions (presets and ticket-implied ones) are kept under their fixed keys and labels. Anything else is ignored.
 * Returns the rows and a list of problems (empty when the answers are acceptable).
 */
export function buildAnswers(
  fields: FormFieldRow[],
  categoryId: string,
  answers: Record<string, unknown>,
): { rows: AnswerRow[]; errors: string[] } {
  const rows: AnswerRow[] = [];
  const errors: string[] = [];
  const given = answers ?? {};
  const seen = new Set<string>();

  for (const f of fields.filter(
    (x) => !x.category_id || x.category_id === categoryId,
  )) {
    seen.add(f.field_key);
    const v = given[f.field_key];
    const empty =
      v === undefined ||
      v === null ||
      v === '' ||
      (Array.isArray(v) && v.length === 0);
    if (
      empty ||
      (f.field_type === 'checkbox' && v === false && f.is_required)
    ) {
      if (f.is_required) errors.push(`${f.label}: required`);
      continue;
    }
    const s = store(f.label, f.field_type, f.options, v);
    if ('error' in s) errors.push(s.error);
    else
      rows.push({
        field_id: f.id,
        field_key: f.field_key,
        field_label: f.label,
        field_type: f.field_type,
        value_text: s.text,
        value_json: s.json,
        is_sensitive: isSensitive(f.field_key, f.field_type),
      });
  }

  for (const [key, v] of Object.entries(given)) {
    if (seen.has(key)) continue;
    const meta = BUILT_IN_FIELDS[key];
    if (!meta || v === undefined || v === null || v === '') continue;
    const s = store(meta.label, meta.type, null, v);
    if ('error' in s) errors.push(s.error);
    else
      rows.push({
        field_id: null,
        field_key: key,
        field_label: meta.label,
        field_type: meta.type,
        value_text: s.text,
        value_json: s.json,
        is_sensitive: isSensitive(key, meta.type),
      });
  }

  if (rows.length > MAX_ANSWERS)
    errors.push(`Too many answers (${MAX_ANSWERS} at most)`);
  return { rows, errors };
}

/* ------------------------------------------------------------------ */
/* QR code                                                             */
/* ------------------------------------------------------------------ */

/** An unguessable 128-bit token, hex. This, not the ticket id, is what the QR code leads to. */
export const newQrToken = (): string => randomBytes(16).toString('hex');

/** What the QR code encodes: a version prefix plus the token. Scanning looks the token up (tickets.qr_token, unique). */
export const qrPayload = (token: string): string => `GA1.${token}`;

/**
 * The QR code as a compact SVG (one path for every dark module, a white quiet zone around it): about 3 KB, the same on the ticket page,
 * in an email and on a wallet pass. Error correction M. Generated with `uqr`.
 */
export function qrSvg(text: string): string {
  const { data, size } = encode(text, { ecc: 'M' });
  let d = '';
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) if (data[y][x]) d += `M${x} ${y}h1v1h-1z`;
  const edge = size + 8;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 -4 ${edge} ${edge}" shape-rendering="crispEdges"><rect x="-4" y="-4" width="${edge}" height="${edge}" fill="#fff"/><path d="${d}" fill="#0b1a2e"/></svg>`;
}
