# GA-060 handoff: events-api

Branch `codex/ga-060-event-reviews-api`, commit `bdc5848` (not pushed).

## Changed paths
- `src/events/events.service.ts`
- `src/events/events.service.spec.ts`

## Contract delta
`GET /events/:id/details` `data` gains `reviews[]` (id, rating, title, body, edition_year, category_label, helpful_count, created_at, author_name; published, newest first, max 20) and `rating_summary` ({ avg, count, distribution }). Nothing existing changed. `user_id`, raw `full_name` and `updated_at` are never selected or returned.

## Join approach
Embed: `author:profiles(full_name)` through the single FK `event_reviews.user_id -> profiles.id`, flattened in code to `author_name` (the embed key is dropped). Not verified against the live API (coordinator smoke). If PostgREST rejects the embed, switch to two reads and a join in code (`shapeReviews` already tolerates `author` null/array).
A second read of `event_reviews` selects only `rating` (cap 10,000) for the distribution. Both reads go through `safeChildRows`, so an error gives `reviews: []` and `distribution: null` without failing the response.

## Commands run
| Command | Result |
| --- | --- |
| `npm run build` | pass |
| `npm test` | pass, 2 suites, 38 tests |
| `npx eslint src/events` | pass, no output |
| Live smoke | not run (coordinator) |

## Notes
Count 0 with no rows yields `distribution` of all zeros (sum equals count); the UI should key on `count`. `avg` is null when count is 0.
