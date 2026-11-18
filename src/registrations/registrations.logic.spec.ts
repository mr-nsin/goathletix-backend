import {
  ageOn,
  buildAnswers,
  istToday,
  isIsoDate,
  newQrToken,
  orderTotals,
  qrPayload,
  qrSvg,
  unitPrice,
  type CategoryRow,
  type FormFieldRow,
} from './registrations.logic';

const cat = (over: Partial<CategoryRow> = {}): CategoryRow => ({
  id: 'c1',
  label: '10K',
  gender: 'open',
  capacity: 100,
  slots_taken: 0,
  price_inr: 800,
  min_age: null,
  max_age: null,
  event_price_tiers: [],
  ...over,
});
const field = (over: Partial<FormFieldRow>): FormFieldRow => ({
  id: 'f1',
  category_id: null,
  field_key: 'city',
  label: 'City',
  field_type: 'text',
  options: null,
  is_required: false,
  ...over,
});

describe('dates', () => {
  it('reads the IST day, not the UTC day', () => {
    expect(istToday(new Date('2026-11-10T20:00:00Z'))).toBe('2026-11-11'); // 01:30 IST the next day
    expect(istToday(new Date('2026-11-10T10:00:00Z'))).toBe('2026-11-10');
  });
  it('counts whole years', () => {
    expect(ageOn('1990-05-04', '2027-01-18')).toBe(36);
    expect(ageOn('1990-05-04', '2027-05-04')).toBe(37); // birthday on the day
    expect(ageOn('1990-05-05', '2027-05-04')).toBe(36); // the day before
  });
  it('rejects impossible dates', () => {
    expect(isIsoDate('2026-02-30')).toBe(false);
    expect(isIsoDate('2026-13-01')).toBe(false);
    expect(isIsoDate('1990-05-04')).toBe(true);
  });
});

describe('unitPrice', () => {
  it('uses the tier whose window holds today', () => {
    const c = cat({
      event_price_tiers: [
        {
          id: 't1',
          label: 'Early bird',
          price_inr: 600,
          valid_from: '2026-10-01',
          valid_until: '2026-11-30',
        },
        {
          id: 't2',
          label: 'Regular',
          price_inr: 900,
          valid_from: '2026-12-01',
          valid_until: null,
        },
      ],
    });
    expect(unitPrice(c, '2026-11-12')).toEqual({ price: 600, tierId: 't1' });
    expect(unitPrice(c, '2026-12-05')).toEqual({ price: 900, tierId: 't2' });
  });
  it('falls back to the category price, and to nothing when there is no price', () => {
    expect(unitPrice(cat(), '2026-11-12')).toEqual({
      price: 800,
      tierId: null,
    });
    expect(unitPrice(cat({ price_inr: null }), '2026-11-12')).toBeNull();
  });
  it('treats a free category (0) as a price', () => {
    expect(unitPrice(cat({ price_inr: 0 }), '2026-11-12')).toEqual({
      price: 0,
      tierId: null,
    });
  });
});

describe('orderTotals', () => {
  it('adds GST only when the event charges it on top', () => {
    expect(orderTotals([1000, 500], 'exclusive', 18)).toEqual({
      subtotal_inr: 1500,
      tax_inr: 270,
      fee_inr: 0,
      discount_inr: 0,
      total_inr: 1770,
    });
    expect(orderTotals([1000, 500], 'inclusive', 18).total_inr).toBe(1500);
  });
});

describe('buildAnswers', () => {
  it('keeps an organiser question under its key, with the organiser label and a link to the field row', () => {
    const { rows, errors } = buildAnswers(
      [
        field({
          id: 'f9',
          field_key: 'shirt_fit',
          label: 'Shirt fit',
          field_type: 'select',
          options: ['Slim', 'Regular'],
          is_required: true,
        }),
      ],
      'c1',
      { shirt_fit: 'Slim' },
    );
    expect(errors).toEqual([]);
    expect(rows[0]).toMatchObject({
      field_id: 'f9',
      field_key: 'shirt_fit',
      field_label: 'Shirt fit',
      value_text: 'Slim',
      is_sensitive: false,
    });
  });
  it('requires what the organiser marked required, and rejects values outside the options', () => {
    const f = field({
      field_key: 'shirt_fit',
      label: 'Shirt fit',
      field_type: 'select',
      options: ['Slim'],
      is_required: true,
    });
    expect(buildAnswers([f], 'c1', {}).errors).toEqual(['Shirt fit: required']);
    expect(buildAnswers([f], 'c1', { shirt_fit: 'Baggy' }).errors[0]).toMatch(
      /not one of the options/,
    );
  });
  it('applies a field only to the ticket type it is scoped to', () => {
    const f = field({ category_id: 'c-other', is_required: true });
    expect(buildAnswers([f], 'c1', {}).errors).toEqual([]);
  });
  it('stores an emergency contact as searchable text plus a structured object, flagged sensitive', () => {
    const { rows, errors } = buildAnswers([], 'c1', {
      emergency_contact: {
        name: 'Meera',
        phone: '98765 43210',
        relation: 'Spouse',
      },
    });
    expect(errors).toEqual([]);
    expect(rows[0]).toMatchObject({
      field_key: 'emergency_contact',
      value_text: 'Meera 98765 43210 Spouse',
      is_sensitive: true,
      value_json: { name: 'Meera', phone: '98765 43210', relation: 'Spouse' },
    });
  });
  it('flags medical answers sensitive and reads checkboxes as yes or no', () => {
    const { rows } = buildAnswers([], 'c1', {
      medical_conditions: 'Asthma',
      helmet_ack: true,
      blood_group: 'O+',
    });
    const by = Object.fromEntries(rows.map((r) => [r.field_key, r]));
    expect(by.medical_conditions.is_sensitive).toBe(true);
    expect(by.blood_group.is_sensitive).toBe(true);
    expect(by.helmet_ack).toMatchObject({
      value_text: 'yes',
      value_json: true,
      is_sensitive: false,
    });
  });
  it('ignores keys nobody asked for, and rejects a bad phone', () => {
    expect(
      buildAnswers([], 'c1', { made_up: 'x', __proto__x: 'y' }).rows,
    ).toEqual([]);
    expect(buildAnswers([], 'c1', { whatsapp: '12345' }).errors[0]).toMatch(
      /10-digit/,
    );
  });
});

describe('QR code', () => {
  it('makes a fresh 128-bit token each time and a versioned payload', () => {
    const a = newQrToken();
    expect(a).toMatch(/^[0-9a-f]{32}$/);
    expect(newQrToken()).not.toBe(a);
    expect(qrPayload(a)).toBe(`GA1.${a}`);
  });
  it('renders a compact, self-contained SVG with a quiet zone', () => {
    const svg = qrSvg(qrPayload('0123456789abcdef0123456789abcdef'));
    expect(
      svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 -4 '),
    ).toBe(true);
    expect(svg).toContain('<path d="M');
    expect(svg.length).toBeLessThan(6000);
  });
  it('is deterministic for the same text', () => {
    expect(qrSvg('GA1.abc')).toBe(qrSvg('GA1.abc'));
  });
});
