import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting seed process...');
  const seedFilePath = path.join(__dirname, '../../scripts/events_seed.json');
  console.log(`Reading seed file from ${seedFilePath}`);

  if (!fs.existsSync(seedFilePath)) {
    throw new Error(`Seed file not found at path: ${seedFilePath}`);
  }

  const rawData = fs.readFileSync(seedFilePath, 'utf8');
  const events = JSON.parse(rawData);
  console.log(`Loaded ${events.length} events from seed file.`);

  // 1. Extract and insert unique organizers
  // Typed as string[] explicitly: `new Set(...)` over an `any[]` yields `Set<unknown>`, so
  // `name` arrived as `unknown` and failed Prisma's `OrganizerCreateManyInput` (TS2322).
  const organizerNames: string[] = Array.from(
    new Set(
      events
        .map((e: any): unknown => e.organizer_name)
        .filter((n: unknown): n is string => typeof n === 'string' && n !== ''),
    ),
  );
  console.log(`Found ${organizerNames.length} unique organizers.`);

  console.log('Inserting organizers...');
  const organizerData = organizerNames.map((name: string) => ({
    name,
    isVerified: true,
  }));

  await prisma.organizer.createMany({
    data: organizerData,
    skipDuplicates: true,
  });

  // Query all organizers to build name -> id map
  const dbOrganizers = await prisma.organizer.findMany({
    select: { id: true, name: true },
  });
  const organizerMap = new Map<string, string>();
  for (const org of dbOrganizers) {
    organizerMap.set(org.name, org.id);
  }
  console.log('Organizers map built.');

  // 2. Prepare events data
  console.log('Preparing events data...');
  const eventData = events.map((event: any, index: number) => {
    const orgId = event.organizer_name
      ? organizerMap.get(event.organizer_name)
      : null;

    // Hash source_id and md5 payload
    const hashPayload = crypto
      .createHash('md5')
      .update(JSON.stringify(event))
      .digest('hex');
    const sourceId = `seed_${hashPayload.substring(0, 16)}_${index}`;

    return {
      sourceId,
      eventName: event.event_name,
      sportType: event.sport_type,
      // Accept both shapes: `start_date` is the post-ADR-001 key, `event_date` is
      // tolerated for seed files generated before the cutover.
      startDate: new Date(event.start_date ?? event.event_date),
      endDate: new Date(event.end_date ?? event.start_date ?? event.event_date),
      city: event.city,
      state: event.state,
      venue: event.venue,
      distanceOptions: event.distance_options || [],
      elevationGain: event.elevation_gain || null,
      difficulty: event.difficulty || 'Intermediate',
      priceRange: event.price_range || null,
      registrationUrl: event.registration_url || '',
      organizerId: orgId,
      terrain: event.terrain || null,
      isVirtual: event.is_virtual || false,
      status: event.status || 'upcoming',
      md5PayloadHash: hashPayload,
    };
  });

  console.log('Inserting events in batches...');
  const batchSize = 1000;
  for (let i = 0; i < eventData.length; i += batchSize) {
    const batch = eventData.slice(i, i + batchSize);
    await prisma.event.createMany({
      data: batch,
      skipDuplicates: true,
    });
    console.log(
      `Inserted batch ${Math.floor(i / batchSize) + 1} (${i + batch.length}/${eventData.length})`,
    );
  }

  console.log('Seed process completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
