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
| (o) Kitty   12 samples   seen 4 min ago                          |
| (o) Pancake  9 samples   seen 4 h ago              + Add a cat   |
+------------------------------------------------------------------+
| 14 to review                       [Select]  [Confirm all Pancake]|
| [face][face][face][face][face][face][face]                       |
|  Pan?  Pan?  Kit?   ?    Pan?  Pan?  Kit?     <- suggestion chip  |
| tap confirms the suggestion; long press to choose                 |
+------------------------------------------------------------------+
| Kitty, 12 samples        [crop][crop][crop]...  x removes         |
| Pancake, 9 samples       [crop][crop][crop]...                    |
+------------------------------------------------------------------+
```

One card, `kibble-cats-card`, full width. The suggestion under each crop is Kibble's classifier
when it is confident, else the feeder's own identifier, else nothing; the chip carries a small
mark saying which. Tap confirms with a five-second undo; long press (or the chooser button) opens
the picker: each cat, "Not a cat", "Skip". Select mode adds checkboxes and a bulk bar. Removing
a sample from a cat's gallery returns it to the inbox. Empty inbox: "Nothing to review. New
crops arrive when a cat is identified at the bowl." Empty cats: "No cats yet. Add one to start
training." Errors say what failed and what to do.

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

- WebSocket commands, all taking `entry_id`:
  - `kibble/timeline` → `{"items":[...]}` merging detections (`kind:"detection"`, `class`,
    `ts`, `cat`, `pet_id`, `vendor_cat`, `image`) and feed cycles (`kind:"feed"`, `ts`,
    `amount`, `hopper`, `outcome`, `before`, `after`), newest first, at most 100.
  - `kibble/cats` → `{"cats":[{"name","samples","last_seen","avatar","vendor_pet_id","color_index"}]}`.
  - `kibble/faces/pending` → `{"crops":[{name, ts, vendor_pet_id, vendor_cat, guess}]}`.
  - `kibble/faces/samples` `{cat}` → `{"samples":[{name, ts}]}`.
- HTTP view, authenticated, `GET /api/kibble/{entry_id}/image/{kind}/{name}` with `kind` one of
  `event`, `feed`, `pending`, `sample/{cat}`; proxies the JPEG with its content type and
  `Cache-Control: private, max-age=31536000, immutable` (names are unique per capture). Cards
  fetch with `hass.fetchWithAuth` and display object URLs.
- Services: existing `label_face`, `add_cat`; new `unlabel_face {cat, name}`.
- Cards re-read a WS command when the relevant entity changes (`sensor.*_last_detection`,
  `sensor.*_pending_faces`, `sensor.*_last_seen_pet`); push makes that near-instant.

Cards (`kibble-card` repo, one bundle `kibble-card.js`): `kibble-card` (hero), `kibble-timeline-card`,
`kibble-cats-card`. Each has a visual editor with only the device picker; every entity id is
resolved from the device. Container queries, not viewport queries. Keyboard focus visible.
