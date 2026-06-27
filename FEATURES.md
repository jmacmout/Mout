# Mout — Feature Documentation

A concise reference of every feature in the Mout prototype, how each works, and how screens connect.

---

## Navigation

A floating pill at the bottom of every screen contains five tabs: **Home, Map, Friends, Plan, Profile.**

- The active tab expands into an icon + label pill with a spring animation. Inactive tabs collapse to icon-only.
- Tapping any tab instantly switches the active screen. The Map screen stays mounted in the background at all times (so the map never reloads when switching away and back).
- The nav is hidden when any full-screen modal is open (Publish Adventure, Premium, Notifications).

---

## Home

The default landing screen. Gives users a quick snapshot of their activity and their network.

### Header
Displays the user's circular avatar, a contextual greeting ("Welcome back 👋"), their display name ("Hi, Jack!"), and their handle (@jackmcandrew).

### Stat Cards
Two side-by-side cards show:
- **Adventures** — total number of logged adventures.
- **Upcoming** — count of planned adventures the user has RSVP'd to.

Each card has a large number, a label, and a teal icon.

### Tab Filter
Three pill buttons — **Recent, Upcoming, Friends** — filter the card row below. The active tab is filled with the accent color; inactive tabs are glass. Switching tabs swaps the card row instantly.

### Card Rows (horizontal scroll)
Each tab renders a horizontally scrollable row of cards. A second card is always partially visible to signal scrollability.

- **Recent** — The user's own logged adventures. Each card shows a cover photo, adventure title, and stats (distance, elevation, duration).
- **Upcoming** — Planned group adventures from the Plan section. Each card shows a cover photo, a "X going" badge (top-right), adventure name, trail name (in accent color), and date/time.
- **Friends** — Adventures posted by friends in the network. Each card shows a cover photo, a relation tag (e.g. "Hiking Buddy"), the friend's avatar + display name + verified badge, post title, and stats.

---

## Map

A full-screen interactive map powered by MapTiler. The map fills the entire phone and persists in memory across tab switches.

### Search Bar
A floating search bar at the top of the screen. Currently decorative — shows placeholder text "Search places…".

### Map Type Dropdown
A dropdown button sits next to the search bar. It shows the current map mode and opens a list of three options:
- **2D Map** — Default mode, free for all users. Shows adventure pins and trail lines.
- **3D Topo Map** — Pro-only. Tapping it triggers the Premium upgrade modal instead of switching.
- **Wishlist Map** — Pro-only. Same behavior — triggers Premium modal.

When a premium option is selected, the map reverts to the previous mode and opens the upgrade flow.

### Adventure Pins
Each logged adventure location is marked with a custom circular pin (avatar photo) on the map. Trail lines are drawn between known coordinates for logged trails. Tapping a pin opens the bottom sheet.

### Bottom Sheet
Tapping a pin slides up a bottom sheet (with a dim backdrop overlay behind it). The sheet contains a compact **Postcard** for that location:
- Cover photo, location pill, user avatar + name, caption (2-line clamp), hike stats (elevation, distance, duration), like/comment/bookmark actions.
- Tapping the backdrop or an X dismisses the sheet with a slide-down animation.

### Map Controls
A small vertical panel (bottom-right, clear of the nav) has three buttons: **zoom in (+), zoom out (−), and locate** (flies the camera to a default Yosemite coordinate).

---

## Friends

A social feed screen showing activity from the user's network.

### Top Nav
- **Friends** label (glass pill, left)
- **Notifications bell** with an unread badge count. Tapping opens the Notifications modal.
- **Camera button** (right). Tapping opens the Publish Adventure flow.

### Stories Row
A horizontally scrollable row of portrait story cards.
- **Your Story** — the user's own avatar with a "+" button to add a new story.
- **Friend cards** — each friend has a portrait photo card with a gradient ring border and their small avatar inset at the top-left. Tapping is currently decorative.

### Post Feed
A scrollable vertical feed of **Friend Post Cards**. Each card has:
- **Header row** — friend's avatar, display name, verified badge (blue circle with checkmark), timestamp, location, and a relation pill (one of: Hiking Buddy, Trail Partner, Summit Pal, Base Camp Crew).
- **Stacked photo layout** — a large main photo (left, full height) with a smaller secondary photo rotated slightly behind it (top-right). Creates a layered depth effect.
- **Caption** — full-text adventure caption below the photos.
- **Stats row** — boot emoji + distance and duration.
- **Action row** — Like pill (heart + count) and Comment pill (bubble + count). Tapping Like toggles the filled heart state and increments the count. The button pulses on tap.

---

## Publish Adventure

A full-screen modal that slides up from the bottom. Accessed via the camera button on Friends or the "+" button elsewhere. Used to log a completed adventure.

### Flow

1. **Photo Card** — A cover photo placeholder with an "Add +" button overlaid. A small X button (top-left of the photo) closes the modal.
2. **Adventure Notes** — A textarea for the user to write a caption or trip summary.
3. **Add Location** — A text input with location search. As the user types, a live-filtered dropdown shows matching location suggestions (e.g. "Half Dome, Yosemite NP"). Selecting a suggestion fills the field and shows a confirmation checkmark.
4. **Tag People** — A row of removable friend avatar bubbles. Each tagged person has a small X to untag them. An "add person" button (user icon) sits at the left for adding more.
5. **Publish Adventure button** — Fixed at the bottom of the screen. Tapping would submit the adventure (not wired to state in prototype).

---

## Plan

A group adventure planning hub. Manages three internal views: **List, New, Detail.**

### List View
The default Plan view. Shows:
- **Header** — "Plan" title and a subtitle ("Upcoming adventures with your crew").
- **Plan New Adventure button** — Full-width primary CTA. Tapping navigates to the New Adventure form.
- **Adventure cards** — One per planned adventure. Each card has:
  - A cover photo strip with a "X going" badge (top-right corner).
  - Adventure name, trail name (accent color), date and time.
  - An AllTrails link and creator attribution ("by [name]") at the bottom of the card.
  - Tapping a card navigates to its Detail view.

### New Adventure Form
A scrollable form for creating a group adventure. Fields:
- **Adventure Name** — free text input.
- **Trail Name** — free text input.
- **AllTrails Link** — URL input.
- **Date & Time** — a datetime input picker.
- **Description** — a multiline textarea for trip details.
- **Invite Friends** — an avatar-tagged input similar to the Publish Adventure tag people field.
- **Visibility** — a toggle between "Friends Only" and "Public".
- **Create Adventure button** — fixed at the bottom, above the nav. Tapping would create the adventure (not persisted in prototype).

A back arrow (top-left) returns to the List view.

### Detail View
A deep-dive view for a specific planned adventure. Sections from top to bottom:

- **Sticky nav** — back arrow (returns to List) + share button.
- **Cover photo** — full-width image with a date chip overlaid at the bottom.
- **HOST** — the organizer's avatar and display name.
- **GOING** — overlapping circular avatars for each confirmed attendee. If more than four are going, the fifth avatar shows a count of the overflow (e.g. "+3").
- **DESCRIPTION** — the organizer's trip notes in a card.
- **TRAIL** — trail name in accent color and an AllTrails external link.
- **COMMENTS** — a list of existing comments (avatar, name, text, timestamp) followed by a text input + send button for adding a new comment.
- **RSVP buttons** — fixed above the nav (so they never overlap). Three options: **Going** (fills with accent gradient when selected), **Maybe** (subtle accent tint), **Can't Go** (subtle red tint). Only one can be active at a time.

---

## Profile

The user's personal profile page.

### Top Nav
Two glass icon buttons float in the top corners:
- **Pencil/edit button** (left) — for editing profile details.
- **Settings button** (right) — for app settings.

### Header
Circular avatar with an accent-color border, display name, handle, and two stats side by side: **Friends** count and **Adventures** count.

### My Adventures — Stacked Card Deck
A horizontally scrollable deck of the user's logged adventures displayed as stacked cards. Cards are layered with vertical offsets so the deck reads as a physical stack. Scrolling left/right reveals each adventure:
- Each card shows the user's small avatar (top-left inset), a cover photo, adventure title, and stats (distance, elevation, duration).
- The frontmost card is fully visible; cards behind it peek above and below.

### Add Adventure Button
A full-width primary button ("+ Add Adventure") floats above the nav, giving quick access to logging a new adventure (opens the Publish Adventure flow).

---

## Premium (Pro Upgrade)

A full-screen modal triggered when a user taps a Pro-locked feature (3D Topo Map, Wishlist Map). Slides up from the bottom.

### Contents
- A Pro badge and headline.
- A list of seven benefit items, each with a title and subtitle:
  - Up to 10 photos per adventure (free allows 1)
  - Wishlist map toggle
  - Heatmap overlay
  - 3D topo map toggle
  - Unlimited wishlist saves (free allows 10)
  - Organize wishlist into named lists
  - Priority customer support
- A full-width upgrade CTA button.
- An X button to dismiss.

---

## Notifications

A full-screen modal that slides up from the Friends screen notification bell. Displays a list of recent activity events from the user's network. Dismissed by tapping the X or back button.

---

## Shared Components

### Postcard
A reusable adventure card used in the Map bottom sheet. Displays: cover photo, location pill, user avatar + name + timestamp, caption (2-line clamp), hike stats, and like/comment/bookmark actions.

### Like Button
Used in Postcard and Friend Post Cards. Tapping toggles a filled heart state, increments the displayed count by 1, and triggers a brief scale pulse animation. State is shared across the whole app so a like on the Map bottom sheet and on the Friends feed are in sync.

### Verified Badge
A small filled blue circle with a white checkmark, displayed inline next to usernames on Friend Post Cards. Indicates a verified account.

### Location Pill
A small frosted glass chip with a map pin icon and a place name. Used in the Postcard and on Map pins to indicate where an adventure took place.

### Relation Tag
A pill label shown on Friend Post Cards and Home Friends cards indicating the relationship between the viewer and the poster: Hiking Buddy, Trail Partner, Summit Pal, or Base Camp Crew.
