"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const crypto = __importStar(require("crypto"));
require("dotenv/config");
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
}
const pool = new pg_1.Pool({ connectionString });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
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
    const organizerNames = Array.from(new Set(events.map((e) => e.organizer_name).filter(Boolean)));
    console.log(`Found ${organizerNames.length} unique organizers.`);
    console.log('Inserting organizers...');
    const organizerData = organizerNames.map(name => ({
        name,
        isVerified: true,
    }));
    await prisma.organizer.createMany({
        data: organizerData,
        skipDuplicates: true,
    });
    const dbOrganizers = await prisma.organizer.findMany({
        select: { id: true, name: true }
    });
    const organizerMap = new Map();
    for (const org of dbOrganizers) {
        organizerMap.set(org.name, org.id);
    }
    console.log('Organizers map built.');
    console.log('Preparing events data...');
    const eventData = events.map((event, index) => {
        const orgId = event.organizer_name ? organizerMap.get(event.organizer_name) : null;
        const hashPayload = crypto.createHash('md5').update(JSON.stringify(event)).digest('hex');
        const sourceId = `seed_${hashPayload.substring(0, 16)}_${index}`;
        return {
            sourceId,
            eventName: event.event_name,
            sportType: event.sport_type,
            startDate: new Date(event.event_date),
            endDate: event.end_date ? new Date(event.end_date) : new Date(event.event_date),
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
        console.log(`Inserted batch ${Math.floor(i / batchSize) + 1} (${i + batch.length}/${eventData.length})`);
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
//# sourceMappingURL=seed.js.map