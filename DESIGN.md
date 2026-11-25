# Feeder dashboard: design plan

The Home Assistant dashboard for one Kibble feeder (`cat-feeder`). This is the plan the cards,
the integration bridge and the dashboard YAML are built against. Subject: two cats (Kitty,
Pancake) and a camera feeder in the plant room; audience: the household, on a phone most of the
time, a tablet sometimes, a wall panel occasionally. Primary job: answer "is everything fine with
the cats' food, and who has been by" in one glance, and make an extra portion one safe gesture
away. Secondary job: turn the feeder's own face crops into a trained identifier, by confirming
what it already thinks rather than labelling from scratch.

## What people do here, ranked

1. Glance (many times a day, phone): food level, who ate, is the feeder online. Above the fold.
2. Watch: the live stream, when something is happening.
3. Act: an extra portion, or cancel a dispensing feed. Fast, and impossible to trigger by accident.
4. Review the day: feeds and visits as one timeline, with pictures, per cat.
5. Train: confirm or correct the cats in a batch of crops. A task mode, not a glance item.
6. Configure: schedule, sounds, night vision, cloud, Wi-Fi. Rare; behind a gear.

Jobs 1 to 4 share a page. Job 5 gets its own view ("Cats"). Job 6 lives in pop-ups.

## The memorable thing

The cats' own faces are the interface. Every place a cat is named (presence, timeline rows,
training suggestions) shows a round avatar cut from that cat's best labelled crop. Before any
training, the avatar is a monogram in the cat's colour, and the training inbox is what makes
the faces appear. Training is confirmation: each pending crop already carries what the feeder's
own identifier said and what Kibble's classifier thinks, so the default gesture is one tap that
means "yes". Everything else on the page is quiet.

## Tokens

Colour. The dashboard lives inside the user's HA theme, light or dark, so the base palette is the
theme's: `--card-background-color`, `--primary-text-color`, `--secondary-text-color`,
`--divider-color`, `--primary-background-color`. On top of that:

| name | value | role |
|---|---|---|
| kibble | `#F4A452` | the one accent: feed action, dispensing state, active picker segment |
| kibble-deep | `#DE8A3A` | the accent on light surfaces where `#F4A452` fails contrast |
| ink | `#3A2C28` | text on the accent |
| live | `#E5484D` | the live dot only; never for errors (errors use `--error-color`) |
| cat palette | `#3FA7A0` teal, `#9A5B9E` plum, `#7FA05A` sage, `#4F86C6` blue | one per enrolled cat by index; monograms, presence rings, timeline marks, label chips |

The accent is the colour of kibble; it is used for exactly one family of things (feeding) so it
stays legible as "this dispenses food".

Type. The theme's font (`--paper-font-body1_-_font-family`, Roboto by default): a dashboard
should not bring its own typeface into HA. Personality comes from scale and weight, not family.
Scale: 12 caption, 14 body, 16 titles (600), 22 status line, 34 hero numbers (600, tabular
figures). Sentence case everywhere. No all-caps labels, no eyebrows, no middle-dot metadata
strings; when two facts share a line they are a sentence ("Next feed 07:30, three a day").

Shape and surface. Two radii carry hierarchy: containers use the theme's card radius; elements
inside (thumbnails, chips, segments) use 8 px; avatars are round. The video hero is flush: no
card padding around the stream. The timeline is a list with a thin time rail, not stacked cards.

Spacing. 4-px base: 4, 8, 12, 16, 24.

Motion. Two orchestrated moments only: the hold-to-feed ring filling (answers the press), and the
kibble falling while dispensing (shows the state). Everything else is a 150 ms state change.
`prefers-reduced-motion` disables both animations and keeps the state colour.

## Layout

Two views in one dashboard. Sections layout, so HA handles the responsive grid and the phone
order is the section order.

View "Feeder", `max_columns: 3`, phone stacks top to bottom:

```
wide (>= 1024)                                         phone (<= 640)
+-------------------------------------+---------------+  +----------------+
| live video, flush                   | bowl illus.   |  | live video     |
|  * live   Pancake seen 4 min ago    |  38%    71%   |  |  * live  chips |
|                                     | Next feed     |  +----------------+
|                                     | 07:30, 3/day  |  | bowl  38%  71% |
|                                     | [1][2][3][4]  |  | next 07:30     |
|                                     | ( hold: feed )|  | [1][2][3][4]   |
+-------------------------------------+---------------+  | ( hold: feed ) |
| today                               | cats          |  +----------------+
| 18:04 (o) Pancake ate       1m40    | (o) Kitty     |  | cats  (o) (o)  |
| 17:22 (o) Pancake came by           |     here now  |  +----------------+
| 12:10 (o) Kitty ate                 | (o) Pancake   |  | today          |
| 07:30  |  fed 5 portions  [before]  |     4 h ago   |  |  ...           |
|        |                  [after ]  +---------------+  |                |
| ...                                 | online  wifi  |  +----------------+
|                                     | desiccant 21d |  | status chips   |
+-------------------------------------+---------------+  +----------------+
```

Sections: (1) `kibble-card` hero, `column_span: 2`; (2) the same card's control column is part of
the hero on wide screens and stacks under it on phones, which the card already does with
container queries; (3) `kibble-timeline-card`, span 2; (4) cats: one Mushroom template card per
enrolled cat; (5) Mushroom chips for status (online, Wi-Fi, desiccant, cloud, detections today).
Pop-ups (Bubble Card, hash routed): `#settings` from the hero's gear, `#schedule` from the
"Next feed" line. Left aligned throughout; numbers right aligned in their own column.

View "Cats":

```
+------------------------------------------------------------------+
| (o) Kitty    152 photos trained   57% recognized, still learning  |
| (o) Pancake   24 photos trained   86% recognized, learned         |
|                                                     + Add a cat   |
+------------------------------------------------------------------+
| (?) Check photos                                         [8]  >   |
+------------------------------------------------------------------+
| Kitty, 152 photos       [crop][crop][crop]...  x removes          |
+------------------------------------------------------------------+
```

One card, `kibble-cats-card`, full width. It no longer names photos itself: the "Check photos"
bar opens the review screen below, the one place photos get answered, with a live line about
what Kibble is learning from those answers. Empty cats: "No cats yet. Add one to start
training." Errors say what failed and what to do; once cats have been shown, a failed read shows
a quiet "Reconnecting…" and retries by itself.

## Checking photos: one photo, one answer

Telling Kibble who is in a photo is the job that makes recognition better, and it is
repetitive, so it gets one purpose-built screen (`components/kibble-review-queue.ts`, a native
top-layer `<dialog>`) and every other surface leads into it.

```
phone
+---------------------------+
| 12 photos left          x |
| +-----------------------+ |
| |      big crop         | |
| | Nov 11, 1:05 PM, meal | |
| +-----------------------+ |
| See whole picture         |
| [ Kitty  looks like ]     |
| [ Pancake ]               |
| [ Both in this photo ]    |
| [ Not a cat ]             |
| [ Don't use ]             |
|   Not used for learning   |
| Undo                      |
+---------------------------+
```

- **The unit is the photo**, not the visit: each screen is one photo and up to five answers.
  A cat's name; "Both in this photo" (only with exactly two cats); "Not a cat"; "Don't use"
  (never used for learning, and taken out of training if it was). Kibble's server chooses which
  photos and in what order (`kibble/review/photos`); the card only asks for the next page and
  shows "N photos left" from the server's own count.
- **One tap answers and moves on**: tap a button, press its number key, or (two cats) swipe
  towards that cat. Kibble's guess is highlighted ("looks like Kitty"); there is no confirm
  step. "See whole picture" shows the full frame with the photo's box outlined. Undo takes the
  last answer back (`follow`).
- **Who ate?** After an answer that makes a meal two-cat, the server says so (`needs_ate`) and
  the card asks once, "Who ate?" with the time of the meal. It can be skipped or closed.
- **Answers are never lost.** Every answer goes into a saved list first
  (`lib/answer-outbox.ts`, one per Home Assistant entry, kept in the browser), and is sent in
  order. A failed send is retried after 1, 2, 5, 10, then every 30 seconds, or at once with
  "Send now"; the list survives closing the screen or reloading the page and is sent again
  when a card loads. The server accepts every answer immediately and repeating one is harmless.
  Only a photo that no longer exists, or an answer Kibble refuses, is dropped, with one calm
  line saying so. The screen says "N answers waiting to send" while any are waiting.
- **The screen is never blank**: a placeholder while loading, then the photo, then "All caught
  up" with a summary (per cat, both, not a cat, not used), or a short message with Retry. After
  something was shown, a failed read shows a quiet "Reconnecting…" and retries by itself
  (`lib/ws-query.ts`, 15 second timeout, last good data kept).
- **Learning is visible** (`kibble-learning-line`, fed by `kibble/learning/subscribe`, one
  shared subscription per entry): "12 answers saved, learning 340 of 1,400 visits", "12 answers
  saved, learning starts when you pause", "Learning from your answers…", or "Something went
  wrong, trying again in 30 s. Your answers are safe." Nothing is shown when idle. The cats
  card also shows a short, dismissible summary of the last finished pass.
- **Entry points** are one component, `kibble-review-entry`: a "Check photos" bar on the
  timeline and cats cards, an "N to check" chip on the hero. Every delivered answer announces
  itself (`lib/review-bus.ts`) so the other cards refresh without a reload.
- **The event sheet and photo viewer** use the same answers per photo (`kibble/sample/label`)
  with Undo, and the sheet shows "Who ate?" when the server asks. Photo tags read "Not used"
  (dimmed), "Both cats" and "Not a cat". No surface names a whole visit any more.
- **One answer button everywhere**, `components/kibble-choice.ts`: the queue, the event sheet
  and the photo viewer use it, with three states (plain, dashed "Guess", filled "Your answer")
  in the cat's own colour.

Borrowed, deliberately: the fixed number-key answers and pre-selected model guess from
labelling tools (Label Studio, Prodigy), and the outbox that keeps unsent answers from
offline-first mail and chat apps.

## Review against the generic defaults

- Warm cream plus terracotta: not used; the base is the HA theme and the accent is kibble-orange
  because the subject is kibble. Changed from the current card's tan illustration background:
  the hero is the real video, the bowl illustration sits on the theme surface.
- Identical rounded cards everywhere: the sections grid is cards by nature, so the hero is
  flush video, the timeline is a rail list, and per-cat tiles are the only small cards.
- Eyebrows, all caps, middle dots, arrows: removed, including "3 scheduled · next 07:30" from
  the current card, now "Next feed 07:30, three a day".
- Numbered markers: the timeline is a real sequence, so it has a time rail, not numbers.
- Per-card hover and entrance motion: none; the two animations answer or show a feeding.

## Data contracts

Agent (`kibbled`, port 8765):

- `GET /faces/pending` returns objects, newest last:
  `[{"name":"1789580000-101321488.jpg","ts":1789580000,"vendor_pet_id":101321488|null,
     "guess":{"cat":"Pancake","score":0.83}|null}]`.
  The filename already encodes `ts` and the vendor id (`{ts}-{petid|unknown}.jpg`); a crop
  written before its `track` event lands is renamed from `-unknown` to `-<petid>` when a track
  with `start_time` within 5 minutes of the crop arrives. `guess` is the classifier's verdict
  stored beside the crop when it was captured.
- `GET /faces/samples/<cat>` → `[{"name":"...jpg","ts":...}]`; `GET /faces/samples/<cat>/<name>`
  → JPEG. `GET /cats` gains `"avatar":"<sample name>"|null` (the sample nearest the centroid).
- Existing: `POST /faces/label {name,cat}`, `POST /faces/unlabel {cat,name}`, `POST /cats {name}`,
  `GET /events`, `GET /events/<file>`, `GET /feeds`, `GET /feeds/<file>`.

Home Assistant integration (`custom_components/kibble`):

- WebSocket commands, all taking `entry_id` (`custom_components/kibble/websocket.py`):
  - `kibble/timeline` (`include_visits`, default `false`) → `{"items":[...]}`, newest first, at
    most 100. Each item has a `kind` and `ts`, plus:
    - `"identified"` (a vendor `track`, or a `face` crop someone labelled): `cat` (never null --
      falls back to "Unknown cat"), `paired_class` (`"eat"|"visit"|"face"|null`, which detection
      class the image came from), `image_kind` (`"track"|"event"`, which HTTP image view kind
      resolves `image`), `image` (bare token for that kind, or `null` if nothing paired).
    - `"visit"` / `"eat"` (a detection no `identified` row already claimed as its pairing image;
      `visit` rows only appear when `include_visits` is true): `image` (bare `event`-kind
      filename, or `null`).
    - `"feed"`: `amount`, `hopper` (`"1"|"2"|"both"|null`), `manual`, `before`, `after` (bare
      `feed`-kind filenames, or `null`).
  - `kibble/cats` → `{"cats":[{name, samples, last_seen, avatar, vendor_pet_id, color_index}]}`;
    `color_index` is this cat's 0-based rank in name-sorted order (one stable palette slot per
    enrolled cat). `kibble/cats/delete {name}` deletes one, forwarding to the agent.
  - `kibble/faces/pending` → `{"crops":[{name, ts, vendor_pet_id, vendor_cat, guess}]}`, where
    `guess` is `{cat, score}|null`. `kibble/faces/samples {cat}` → `{"samples":[{name, ts}]}`.
  - `kibble/faces/upload {cat, jpeg_b64}` uploads a browser-cropped reference photo (base64,
    decoded server-side) straight onto a cat, bypassing the pending-crop queue; returns the
    agent's `{name, samples, low_quality?}`. `kibble/faces/delete_sample {cat, name}` removes an
    uploaded (`upload-*`) sample, since it never had a pending-queue entry for `unlabel_face` to
    move it back to.
- HTTP view, authenticated, `GET /api/kibble/{entry_id}/image/{kind}/{name}` with `kind` one of
  `event`, `feed`, `track`, `pending`, `sample/{cat}`; proxies the JPEG with its content type and
  `Cache-Control: private, max-age=31536000, immutable` (names are unique per capture, except
  `track` which re-resolves its pairing live from the agent). Cards fetch with
  `hass.fetchWithAuth` and display object URLs (`lib/image-cache.ts`).
- Services: `label_face {device_id, crop_id, cat}`, `unlabel_face {device_id, cat, name}`,
  `add_cat {device_id, name}`.
- Cards re-read a WS command when the relevant entity's state changes (`lib/ws-query.ts`'s
  `watchKey`, called from each card's `willUpdate`): `kibble-timeline-card` watches
  `sensor.*_last_detection` plus the feeding/dish-after entities; `kibble-cats-card` watches
  `image.*_pending_face` plus `sensor.*_last_seen_pet`; `kibble-card`'s cat-roster read watches
  `sensor.*_last_seen_pet`. The `kibble` repo's agent-side WebSocket push (`docs/33-local-push.md`
  there) makes that near-instant.

Cards (`kibble-card` repo, one bundle `kibble-card.js`): `kibble-card` (hero), `kibble-timeline-card`,
`kibble-cats-card`. Each has a visual editor with only the device picker; every entity id is
resolved from the device. Container queries, not viewport queries. Keyboard focus visible.
