export interface NormalizedEvent {
  id: string;
  eventName: string;
  sportType: string;
  eventDate: string;
  endDate?: string;
  city: string;
  state: string;
  venue: string;
  distanceOptions: string[];
  elevationGain?: string;
  difficulty: string;
  priceRange: string;
  registrationUrl: string;
  organizerName: string;
  terrain?: string;
}

export interface ApiEvent {
  id?: string;
  eventName?: string;
  event_name?: string;
  title?: string;
  sportType?: string;
  sport_type?: string;
  sport?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  event_date?: string;
  date?: string;
  city?: string;
  state?: string;
  venue?: string;
  location?: string;
  distanceOptions?: string[];
  distance_options?: string[];
  distance?: string;
  elevationGain?: string;
  elevation_gain?: string;
  elevation?: string;
  difficulty?: string;
  priceRange?: string;
  price_range?: string;
  price?: string;
  registrationUrl?: string;
  registration_url?: string;
  link?: string;
  organizer?: { name?: string } | string;
  organizerName?: string;
  organizer_name?: string;
  terrain?: string;
}

export function normalizeEvent(event: ApiEvent): NormalizedEvent {
  const eventName = event.eventName || event.event_name || event.title || "Untitled Event";
  
  let sportType = event.sportType || event.sport_type || event.sport || "running";
  if (sportType) {
    sportType = sportType.charAt(0).toUpperCase() + sportType.slice(1).toLowerCase();
  }

  const datePart = (value?: string | Date) => {
    if (!value) return "";
    return typeof value === "string"
      ? value.split("T")[0].split(" ")[0]
      : value.toISOString().split("T")[0];
  };
  const eventDate = datePart(event.startDate ?? event.event_date ?? event.date);
  const endDate = datePart(event.endDate);

  const city = event.city || (event.location ? event.location.split(',')[0].trim() : "Unknown City");
  const state = event.state || (event.location ? (event.location.split(',')[1] || "").trim() : "");
  const venue = event.venue || "";
  
  let distanceOptions: string[] = [];
  if (Array.isArray(event.distanceOptions)) {
    distanceOptions = event.distanceOptions;
  } else if (Array.isArray(event.distance_options)) {
    distanceOptions = event.distance_options;
  } else if (typeof event.distance === 'string') {
    distanceOptions = event.distance.split('/').map((s: string) => s.trim());
  }

  const elevationGain = event.elevationGain || event.elevation_gain || event.elevation || "";
  const difficulty = event.difficulty || "Intermediate";
  const priceRange = event.priceRange || event.price_range || event.price || "Free";
  const registrationUrl = event.registrationUrl || event.registration_url || event.link || "#";
  
  let organizerName = "";
  if (event.organizer && typeof event.organizer === 'object') {
    organizerName = event.organizer.name ?? "Unknown Organizer";
  } else {
    organizerName = event.organizerName || event.organizer_name || event.organizer || "Unknown Organizer";
  }

  const terrain = event.terrain || "";
  const id = event.id || String(Math.random());

  return {
    id,
    eventName,
    sportType,
    eventDate,
    endDate: endDate || undefined,
    city,
    state,
    venue,
    distanceOptions,
    elevationGain,
    difficulty,
    priceRange,
    registrationUrl,
    organizerName,
    terrain
  };
}
