# SQLite in MetarCheck — how favorites are stored

This document explains how the favorites feature persists data with SQLite, why
each piece exists, and what you should know to extend it. It follows the code in
this repo, so you can read it side by side with the actual files.

## What we built

The user searches ~29,000 airports and saves the ones they care about. Saved
airports survive app restarts, reinstall-free updates, and going offline.

| Concern | Where it lives |
| --- | --- |
| Opening the database | `app/(tabs)/_layout.tsx` (`SQLiteProvider`) |
| Table definition + migrations | `db/schema.ts` |
| SQL queries (the data layer) | `db/favorites.ts` |
| React binding | `hooks/use-favorites.ts` |
| Airport search (no SQL, plain JSON) | `lib/airports.ts` |
| UI | `app/(tabs)/favorites.tsx` |

The layering matters: **no SQL is written inside a component**. Components call
the hook, the hook calls the data layer, the data layer talks to SQLite. If you
later swap SQLite for something else, only `db/` changes.

---

## 1. What SQLite actually is here

SQLite is not a server. There is no connection string, no port, no daemon. It is
a C library compiled into your app that reads and writes **a single file** on the
device. `expo-sqlite` is the React Native binding to that library.

The file for this app lives in the app's private documents directory, roughly:

```
<app sandbox>/SQLite/favorites.db
```

Nothing else on the phone can read it. Deleting the app deletes the file.

Two consequences worth internalizing:

- **It is fast.** A query is a function call into C, not a network round trip.
  Reading 20 rows is microseconds.
- **It is still I/O.** Everything is `async` because the work happens off the JS
  thread. Never assume a write has landed until you have awaited it.

---

## 2. Opening the database — `SQLiteProvider`

```tsx
// app/(tabs)/_layout.tsx
<SQLiteProvider databaseName="favorites.db" onInit={migrateDbAsync}>
  {/* the whole tab navigator */}
</SQLiteProvider>
```

`SQLiteProvider` is a React context provider that does three things:

1. Opens (or creates) `favorites.db`.
2. Runs `onInit` **once**, before rendering children.
3. Publishes the open database through context so any descendant can grab it
   with `useSQLiteContext()`.

Because `onInit` blocks children from rendering, your screens can assume the
schema already exists. You never have to write `CREATE TABLE IF NOT EXISTS` in a
query path.

Two details that are easy to get wrong:

- **The provider must be above every component that queries.** Ours wraps the
  whole `(tabs)` navigator, so all three tabs can use the database.
- **`expo-sqlite` must be listed in `app.json` plugins** (it already is). This is
  what links the native library into the build. A missing plugin shows up as a
  runtime "native module not found" error, not a build error.

---

## 3. The schema and migrations — `db/schema.ts`

```sql
CREATE TABLE favorites (
  icao       TEXT PRIMARY KEY NOT NULL,
  iata       TEXT,
  name       TEXT NOT NULL,
  city       TEXT,
  country    TEXT,
  created_at INTEGER NOT NULL
);
```

Design decisions, and the reasoning behind each:

**`icao` is the PRIMARY KEY, not an auto-increment `id`.**
An ICAO code already uniquely identifies an airport worldwide. Using it as the
key means the database itself enforces "you cannot favorite KJFK twice" — we get
deduplication for free, without a `SELECT` before every `INSERT`. A primary key
is also automatically indexed, so lookups by ICAO are fast.

**We copy `name`, `city`, `country` into the row instead of only storing the
ICAO.** This is deliberate denormalization. The alternative — store just the code
and look up the details in `airports.json` on render — is more "correct" but
means the favorites list cannot render until that 7 MB file is parsed. Copying
five short strings makes the saved list self-sufficient.

**`created_at` is an INTEGER.** SQLite has no date type. The three usual options
are an ISO-8601 `TEXT`, a Unix `INTEGER`, or a Julian-day `REAL`. We store
`Date.now()` (milliseconds since epoch) because it sorts correctly as a number
and needs no parsing to compare.

**On types generally:** SQLite is dynamically typed. A column declared `TEXT`
will happily accept a number. The declared type is a *type affinity*, a hint
about how values get converted — not a hard constraint like in Postgres. Do not
rely on it to validate your data.

### Migrations via `PRAGMA user_version`

Every SQLite file has a spare integer slot the library ignores, meant exactly for
this purpose. We use it as a schema version number:

```ts
const row = await db.getFirstAsync<{ user_version: number }>("PRAGMA user_version");
let version = row?.user_version ?? 0;

if (version >= DATABASE_VERSION) return;   // already up to date

if (version === 0) {
  await db.execAsync(`CREATE TABLE favorites (...)`);
  version = 1;
}
// future: if (version === 1) { ALTER TABLE ...; version = 2 }

await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
```

Why this pattern rather than `CREATE TABLE IF NOT EXISTS`:

- A fresh install starts at version 0 and runs every step in order.
- A device on version 1 runs only the steps after 1.
- The steps are cumulative `if`s, not `else if`s — a user upgrading across three
  app versions at once falls through all of them in sequence.

**When you change the schema, you add a new block and bump
`DATABASE_VERSION`. You never edit an existing block** — devices that already
ran it will not run it again, so an edit only affects fresh installs and your
two code paths silently diverge.

### `PRAGMA journal_mode = WAL`

Write-Ahead Logging. Without it, a write locks the whole database and concurrent
reads block. With WAL, writers append to a side log and readers keep going
against the main file. For a mobile app this is essentially always the right
setting. It is persistent — set once, stored in the file — but running it on
every init is harmless and makes the intent visible.

---

## 4. The queries — `db/favorites.ts`

`expo-sqlite` gives you four methods you will use constantly:

| Method | Returns | Use for |
| --- | --- | --- |
| `execAsync(sql)` | nothing | Multi-statement DDL. **No parameters allowed.** |
| `runAsync(sql, ...params)` | `{ changes, lastInsertRowId }` | INSERT / UPDATE / DELETE |
| `getFirstAsync<T>(sql, ...params)` | `T \| null` | A single row |
| `getAllAsync<T>(sql, ...params)` | `T[]` | Many rows |

There is a synchronous variant of each (`runSync`, `getAllSync`, …). Avoid them
in components — they block the JS thread. They are useful in tests and scripts.

### Parameter binding is not optional

```ts
// Correct — the value is sent to SQLite separately from the SQL text.
await db.runAsync("DELETE FROM favorites WHERE icao = ?", icao);

// Wrong — string interpolation. An apostrophe breaks it; a crafted string
// rewrites your query. This is SQL injection.
await db.runAsync(`DELETE FROM favorites WHERE icao = '${icao}'`);
```

Each `?` is a placeholder filled positionally. The database parses the SQL once
and treats the bound value strictly as data — it can never become syntax. Named
parameters (`$icao`, passed as an object) also work and read better once you have
more than three or four.

Note the one exception in our code: `PRAGMA user_version = ${DATABASE_VERSION}`
uses interpolation, because PRAGMA statements cannot take bound parameters. That
is safe only because `DATABASE_VERSION` is a hardcoded constant, never user
input.

### `INSERT OR IGNORE`

```sql
INSERT OR IGNORE INTO favorites (icao, ...) VALUES (?, ...)
```

Inserting a duplicate ICAO would normally raise a constraint violation. `OR
IGNORE` turns that into a silent no-op, so tapping "add" twice is harmless
without a round trip to check first. Related forms worth knowing:

- `INSERT OR REPLACE` — deletes the old row and inserts the new one (loses the
  original `created_at`).
- `INSERT ... ON CONFLICT(icao) DO UPDATE SET ...` — upsert; keeps the row and
  updates chosen columns. This is what you would want if favorites gained an
  editable field like a nickname.

### Reading rows

```ts
return db.getAllAsync<FavoriteAirport>(
  "SELECT icao, iata, name, city, country, created_at FROM favorites ORDER BY created_at DESC",
);
```

Two things to notice. First, we list columns explicitly rather than `SELECT *`
— so the returned shape is guaranteed to match the `FavoriteAirport` type even
if a column is added later. Second, **the generic is a promise, not a check.**
`getAllAsync<FavoriteAirport>` tells TypeScript what to assume; nothing verifies
it at runtime. If your SQL and your type disagree, you get `undefined` at render
time with no compiler error. Keep the type and the `SELECT` list adjacent, as we
do here.

`created_at` comes back as a plain number, which is why the type declares it as
`number`. SQLite returns exactly the JS primitives that map onto its storage
classes: `number`, `string`, `null`, and `Uint8Array` for blobs. There are no
booleans — store `0` / `1` and convert at the boundary.

---

## 5. Connecting SQLite to React — `hooks/use-favorites.ts`

SQLite is not reactive. Writing a row does not tell React to re-render. The hook
bridges that gap with the simplest correct strategy: **the database is the source
of truth, and React state is a snapshot of it.**

```ts
const refresh = useCallback(async () => {
  setFavorites(await listFavoritesAsync(db));
  setLoading(false);
}, [db]);

const add = useCallback(async (airport: Airport) => {
  await addFavoriteAsync(db, airport);
  await refresh();          // re-read, do not patch local state by hand
}, [db, refresh]);
```

Re-reading after every write is a real choice, not laziness. The alternative —
mutating the local array to match what you *think* the write did — drifts from
the database the moment a default value, trigger, or constraint does something
you did not model. Re-reading 20 rows from a local file is far too cheap to
justify that risk.

`isFavorite` is deliberately synchronous and answers from the already-loaded
array. The `isFavoriteAsync` query in `db/favorites.ts` exists for callers that
have not loaded the list — the search screen has, so it uses the cheap path.

### How you would scale this up

At this size the pattern above is right. As the app grows:

- **React Query** (already a dependency here) can wrap these calls, giving you
  caching and invalidation instead of the manual `refresh()`.
- **`useSQLiteContext` + a change listener** — SQLite can report row changes, so
  you could refresh automatically rather than at each call site.
- **Drizzle ORM** has an expo-sqlite driver and a `useLiveQuery` hook that
  re-renders when underlying tables change, plus typed queries that cannot drift
  from the schema.

---

## 6. Why airport *search* does not use SQLite

`lib/airports.ts` searches the 29,308-entry JSON file in JavaScript. That is a
linear scan, and it is worth understanding why it was not put in the database.

The honest tradeoff:

- **JSON scan (what we do):** zero setup, but the whole 7 MB file is parsed into
  memory the first time someone searches, and every keystroke walks the array.
  Fine for one screen; noticeable on a low-end device.
- **Seed the airports into SQLite:** a one-time migration inserts 29k rows, then
  search becomes `WHERE icao LIKE ?`, indexed and memory-cheap. Costs a slow
  first launch and a much larger database file.
- **Ship a prebuilt `.db`** via `SQLiteProvider`'s `assetSource` prop: best of
  both — no seed cost, indexed search — at the price of generating the file as a
  build step.
- **FTS5** (SQLite's full-text search extension) for real fuzzy matching on
  airport names.

We kept the JSON because the scope here is *storing favorites*, and mixing the
static reference data into the same problem would have obscured that. If search
starts feeling slow, the prebuilt-asset route is the one to reach for.

The one optimization we did make: the JSON is loaded with a lazy `require()`
inside the module and cached in a module-scope variable, so it is parsed on first
search rather than at app startup.

---

## 7. Inspecting the database while developing

You cannot open the file with a desktop tool while it is on the device, but:

- **Expo's SQLite DevTools** — with the dev client running, the debugger exposes
  a SQLite panel where you can run ad-hoc queries against the live database.
- **Log it.** `console.log(await db.getAllAsync("SELECT * FROM favorites"))` is
  crude but immediate.
- **Check the schema version** when a migration seems not to have run:
  `await db.getFirstAsync("PRAGMA user_version")`.
- **Reset during development** by uninstalling the app, which deletes the file.
  A stale `user_version` after you edited a migration block in place is the most
  common reason a schema change "doesn't apply".

---

## 8. Adding a column — the full loop

Say you want a `notes` field on each favorite:

1. In `db/schema.ts`, bump `DATABASE_VERSION` to `2`.
2. Add a new block **after** the existing one:
   ```ts
   if (version === 1) {
     await db.execAsync("ALTER TABLE favorites ADD COLUMN notes TEXT");
     version = 2;
   }
   ```
3. Add `notes: string | null` to `FavoriteAirport` and to the `SELECT` list in
   `listFavoritesAsync`.
4. Add an `updateNotesAsync(db, icao, notes)` using
   `UPDATE favorites SET notes = ? WHERE icao = ?`.
5. Expose it from `useFavorites`, awaiting `refresh()` after the write.

Note that SQLite's `ALTER TABLE` is limited — it can rename a table, rename a
column, add a column, and drop a column, but it cannot change a column's type or
constraints. For anything more involved the standard move is: create a new table
with the right shape, `INSERT INTO new SELECT ... FROM old`, drop the old, rename
the new. All inside one migration block.

---

## Reference

- expo-sqlite API — https://docs.expo.dev/versions/latest/sdk/sqlite/
- SQLite language reference — https://sqlite.org/lang.html
- Type affinity, the dynamic-typing rules — https://sqlite.org/datatype3.html
- WAL mode — https://sqlite.org/wal.html
