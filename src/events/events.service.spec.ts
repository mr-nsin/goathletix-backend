import { EventsService } from './events.service';
import { SupabaseService } from '../supabase.service';

/**
 * A minimal, chainable stand-in for the Supabase PostgREST query builder. Every filter method
 * records its call and returns `this` so the fluent chain used by EventsService works
 * unmodified; the terminal `.range()` resolves the recorded `result`.
 */
class FakeQueryBuilder {
  calls: { method: string; args: unknown[] }[] = [];
  result: { data: unknown[]; count: number; error: unknown } = {
    data: [],
    count: 0,
    error: null,
  };

  private record(method: string, args: unknown[]) {
    this.calls.push({ method, args });
    return this;
  }

  select(...args: unknown[]) {
    return this.record('select', args);
  }
  or(...args: unknown[]) {
    return this.record('or', args);
  }
  eq(...args: unknown[]) {
    return this.record('eq', args);
  }
  in(...args: unknown[]) {
    return this.record('in', args);
  }
  ilike(...args: unknown[]) {
    return this.record('ilike', args);
  }
  lte(...args: unknown[]) {
    return this.record('lte', args);
  }
  gte(...args: unknown[]) {
    return this.record('gte', args);
  }
  overlaps(...args: unknown[]) {
    return this.record('overlaps', args);
  }
  textSearch(...args: unknown[]) {
    return this.record('textSearch', args);
  }
  order(...args: unknown[]) {
    this.record('order', args);
    return this;
  }
  range(...args: unknown[]) {
    this.record('range', args);
    return Promise.resolve(this.result);
  }
}

function buildFakeSupabase(
  sportsRows: { slug: string; family: string }[] = [],
) {
  const eventsBuilder = new FakeQueryBuilder();
  const sportsBuilder = {
    select: () => Promise.resolve({ data: sportsRows, error: null }),
  };

  const client = {
    from: (table: string) => {
      if (table === 'sports') {
        return sportsBuilder;
      }
      return eventsBuilder;
    },
  };

  return { client, eventsBuilder } as unknown as {
    client: SupabaseService['client'];
    eventsBuilder: FakeQueryBuilder;
  };
}

describe('EventsService', () => {
  function makeService(sportsRows?: { slug: string; family: string }[]) {
    const { client, eventsBuilder } = buildFakeSupabase(sportsRows);
    const supabaseService = { client } as SupabaseService;
    const service = new EventsService(supabaseService);
    return { service, eventsBuilder };
  }

  it('filters by disciplines using .overlaps on discipline_slugs', async () => {
    const { service, eventsBuilder } = makeService();

    await service.findAll({
      disciplines: 'marathon,badminton',
    });

    const call = eventsBuilder.calls.find(
      (c) => c.method === 'overlaps' && c.args[0] === 'discipline_slugs',
    );
    expect(call).toBeDefined();
    expect(call?.args[1]).toEqual(['marathon', 'badminton']);
  });

  it('filters by ageCategories using .overlaps on age_categories', async () => {
    const { service, eventsBuilder } = makeService();

    await service.findAll({
      ageCategories: 'kids,junior',
    });

    const call = eventsBuilder.calls.find(
      (c) => c.method === 'overlaps' && c.args[0] === 'age_categories',
    );
    expect(call).toBeDefined();
    expect(call?.args[1]).toEqual(['kids', 'junior']);
  });

  it('prefix-matches every token so search works while the user types', async () => {
    const { service, eventsBuilder } = makeService();

    await service.findAll({ search: 'marathon club' });

    const call = eventsBuilder.calls.find((c) => c.method === 'textSearch');
    expect(call).toBeDefined();
    expect(call?.args[0]).toBe('search_vector');
    // `:*` on every token, AND'd. Without the prefix operator a partial word like "Mumb"
    // matches nothing, and the directory queries on every keystroke — so the box reads as
    // broken until a whole word is typed. No `type` means the plain `fts` operator, which
    // is the only one that accepts `:*`.
    expect(call?.args[1]).toBe('marathon:* & club:*');
    expect(call?.args[2]).toEqual({ config: 'simple' });

    // The old ilike-based .or() search must be gone.
    const orCall = eventsBuilder.calls.find((c) => c.method === 'or');
    expect(orCall).toBeUndefined();
  });

  it('strips tsquery operators from user input', async () => {
    const { service, eventsBuilder } = makeService();

    await service.findAll({ search: "run & !(club) | 'x'" });

    const call = eventsBuilder.calls.find((c) => c.method === 'textSearch');
    expect(call?.args[1]).toBe('run:* & club:* & x:*');
  });

  it('resolves family to sport slugs and filters sport_type with .in', async () => {
    const { service, eventsBuilder } = makeService([
      { slug: 'running', family: 'endurance' },
      { slug: 'cycling', family: 'endurance' },
      { slug: 'racquet_sport', family: 'racquet' },
    ]);

    await service.findAll({ family: 'endurance' });

    const call = eventsBuilder.calls.find(
      (c) => c.method === 'in' && c.args[0] === 'sport_type',
    );
    expect(call).toBeDefined();
    expect(call?.args[1]).toEqual(['running', 'cycling']);
  });
});
