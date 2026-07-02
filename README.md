# Last Stand 3D

**Version:** v87 (boss-reflex-ui-v143)
**Genre:** Crowd runner / arcade hyper-casual (Count Masters-style)
**Platform:** Browser-based (WebGL via Three.js)

---

## Tech Stack

| Technology | Details |
|---|---|
| **Three.js** | r128 (CDN: `three.min.js`) |
| **Rendering** | WebGL — mobile-optimized (DPR cap, no shadow maps on mobile) |
| **Audio** | Web Audio API — procedural tones, no external audio files |
| **Haptics** | `navigator.vibrate()` on mobile |
| **Storage** | `localStorage` (save key: `last_stand_3d_meta_v19`) |
| **CSS** | 8 CSS files |
| **Fonts** | Google Fonts: `Black Han Sans` (headings), `Rajdhani` (UI) |
| **Time API** | `timeapi.io` for server-verified daily rewards (local fallback) |
| **Build** | Vanilla JS, no bundlers, no frameworks |

---

## Core Gameplay

- Guide a **crowd of humans** running forward on a lane
- **Drag/swipe left/right** to steer the crowd laterally
- Goal: reach the **AI Army boss** at 520 units
- Along the way: **gates**, **obstacles**, **orbs**, **forced items**
- Crowd uses **sunflower (Fermat spiral) formation**
- Each human is a procedural InstancedMesh character (~11 meshes)
- The first human is a premium **Leader** with aura, halo glow, and head flame

### Gates (Dual-Choice)

Each gate has two panels (left + right). Choose one by steering into it.

| Type | Label | Effect | Good? |
|---|---|---|---|
| add v=10 | +5 | +10 humans | Yes |
| add v=20 | +10 | +20 humans | Yes |
| add v=50 | +15 | +50 humans | Yes |
| add v=100 | +20 | +100 humans | Yes |
| mult v=2 | X2 | Double crowd | Yes |
| mult v=3 | MAX | Triple crowd | Yes |
| sub v=20 | -5 | -20 humans | No |
| sub v=50 | -10 | -50 humans | No |
| sub v=100 | -15 | -100 humans | No |
| sub v=120 | -20 | -120 humans | No |
| double_bad | DANGER | Remove HALF the crowd | No |

### Obstacles (Walls)

- Walls with a single gap to pass through
- Hitting the wall kills humans proportionally
- Successful dodges trigger feedback + combo increment

### Orbs

- Small floating spheres that pull toward the crowd
- Add +1 human each (+5 during Gold Rush)

---

## Game Modes

### Fever Mode
- **Trigger:** 5 consecutive good gates (combo)
- **Duration:** 8 seconds
- Bonus coins, luckier gates, gold road pulse, fever HUD overlay
- End: timer expires (complete) or bad gate hit (broken)

### Boss Fight / Clash Mode
- **Trigger:** Distance reaches 520 units
- AI Army mothership spawns robots in sunflower formation
- **Boss Reflex Mini-Game:** 5-second QTE — swipe/tap matching prompts
- Perfect hits remove 2 AI, late hits remove 1, misses count toward limit

### Army Mode
- **Trigger:** Crowd reaches 500 humans
- Visual upgrade on crowd label, extra spectacle bursts

### Post-Game Bonus Spinner
- On win: bonus wheel with x1/2, x1, x2, x3, x5 (Jackpot) multipliers
- Skin Chest: every 4 wins reveals a locked skin, claimable by rewarded ad or 400 coins
- Skin Trial: locked shop skins can be tried for one run after a rewarded ad, then offered for purchase on the result screen
- Run Streak: consecutive wins add a saved streak badge and reward multiplier, from x1.05 on the second win up to x1.25
- Daily Challenge: one rotating objective per day rewards +400 coins and +25% skin chest charge
- Crowd Milestones: 25 to 1000 humans trigger run spectacle and one-time coin bonuses
- Tap to stop and claim bonus coins

---

## Worlds / Themes

12 planets total, with the original worlds restored and the newer worlds appended:

| ID | Name | Unlock | Road | Edge | Sky |
|---|---|---|---|---|---|
| `mars` | Mars Colony | 1 (default) | `#4A1B12` | `#FF6D2D` | `#150608` |
| `ice` | Frozen Moon | 20 | `#173854` | `#B3F5FF` | `#061826` |
| `saturn` | Saturn Rings | 40 | `#1F1A3D` | `#FFD06A` | `#09071F` |
| `toxic` | Toxic Venus | 60 | `#183018` | `#AEEA00` | `#071A08` |
| `cyber` | Cyber Planet | 80 | `#101D4C` | `#EA80FC` | `#05051F` |
| `void` | Galaxy Void | 100 | `#130B2E` | `#FFD740` | `#060006` |
| `neon_tokyo` | Neon Tokyo | 120 | `#2A174A` | `#00E5FF` | `#040820` |
| `lava_core` | Lava Core | 140 | `#3D0000` | `#FF6D00` | `#1A0000` |
| `ocean_abyss` | Ocean Abyss | 160 | `#003D4D` | `#00BCD4` | `#000A14` |
| `crystal_realm` | Crystal Realm | 180 | `#32205C` | `#EA80FC` | `#0D001F` |
| `digital_void` | Digital Void | 200 | `#001F2E` | `#00E5FF` | `#000000` |
| `cosmic_storm` | Cosmic Storm | 220 | `#1A0050` | `#FFD740` | `#08001A` |

Each world has unique climate particles, sky type, fog density, and visual mood. Select from the **Space Map** overlay, which shows ready/locked/selected states and the next unlock target.

---

## Skins

29 skins across 5 rarity tiers, purchased with coins from the Shop. Premium skins continue the collection after Shadow, but no skin costs more than 2,000,000 coins:

| ID | Name | Rarity | Price | Body |
|---|---|---|---|---|
| `default` | Default | COMMON | Free | `#1E88E5` |
| `ice` | Ice Runner | RARE | 900 | `#7CEBFF` |
| `fire` | Fire Squad | RARE | 2,600 | `#FF6D00` |
| `robot` | Robot Unit | EPIC | 7,200 | `#78909C` |
| `ninja` | Ninja | EPIC | 15,500 | `#161820` |
| `gold` | Gold Hero | LEGENDARY | 42,000 | `#FFD740` |
| `toxic` | Toxic | LEGENDARY | 90,000 | `#76FF03` |
| `galaxy` | Galaxy | MYTHIC | 220,000 | `#6A1B9A` |
| `shadow` | Shadow | MYTHIC | 500,000 | `#101018` |
| `plasma` | Plasma Ranger | LEGENDARY | 650,000 | `#00B8D4` |
| `samurai` | Neon Samurai | LEGENDARY | 720,000 | `#D32F2F` |
| `angel` | Solar Angel | LEGENDARY | 800,000 | `#FFFDE7` |
| `demon` | Inferno Demon | LEGENDARY | 890,000 | `#8B0000` |
| `dragon` | Dragon Scale | LEGENDARY | 980,000 | `#00A86B` |
| `crystal` | Crystal Prism | LEGENDARY | 1,080,000 | `#B3E5FC` |
| `thunder` | Thunder Volt | MYTHIC | 1,180,000 | `#263238` |
| `ghost` | Ghost Phase | MYTHIC | 1,280,000 | `#CFD8DC` |
| `alien` | Alien Core | MYTHIC | 1,380,000 | `#64DD17` |
| `royal` | Royal Guard | MYTHIC | 1,480,000 | `#283593` |
| `pharaoh` | Pharaoh Sun | MYTHIC | 1,580,000 | `#F9A825` |
| `cyber_king` | Cyber King | MYTHIC | 1,660,000 | `#311B92` |
| `void_knight` | Void Knight | MYTHIC | 1,740,000 | `#080015` |
| `frost_lord` | Frost Lord | MYTHIC | 1,800,000 | `#E0F7FA` |
| `solar_flare` | Solar Flare | MYTHIC | 1,860,000 | `#FFB300` |
| `quantum_shift` | Quantum Shift | MYTHIC | 1,910,000 | `#00B0FF` |
| `mecha_gold` | Mecha Gold | MYTHIC | 1,950,000 | `#C8A600` |
| `crimson_reaper` | Crimson Reaper | MYTHIC | 1,980,000 | `#2A0008` |
| `nebula_crown` | Nebula Crown | MYTHIC | 1,990,000 | `#4A148C` |
| `omega_prime` | Omega Prime | MYTHIC | 2,000,000 | `#FFFFFF` |

Rarity colors: COMMON=`#90A4AE`, RARE=`#00E5FF`, EPIC=`#EA80FC`, LEGENDARY=`#FFD740`, MYTHIC=`#FF4081`

Boss Chests have 10% chance to grant a random RARE/EPIC skin.

---

## Controls

| Action | Mobile | Desktop |
|---|---|---|
| Steer | Drag left/right on canvas | Click + drag left/right |
| Boss QTE | Swipe direction / Tap | Arrow keys / Space/Enter |
| Menu | Dock buttons | Click buttons |

---

## UI Features

- **HUD:** Crowd count, distance/progress bar, level label
- **Combo System:** 5 dots for consecutive good gates, streak HUD with coin bonus rates
- **Consequence Bar:** Preview next gate labels
- **Space Map:** Planet selection overlay with preview panel
- **Chest System:** Boss chest charges after 3 wins, 10% skin chance
- **Daily Rewards:** Server-verified via timeapi.io, streak-based coin rewards
- **Missions:** "Win 1 level" (150 coins), "Reach 80 humans" (200 coins)
- **Next Run Goal:** Dynamic rotating goal card with bonus coins
- **Result Screen Ladder:** Timed reveal: title, coins, combo, skin, chest, bonus spinner
- **Phase Flash:** Large centered text for key events
- **Milestone Banner:** Full-screen crowd thresholds from 25 to 1000 humans with slow-motion spectacle and one-time rewards
- **Secret Crowd Waves:** Rare events: TEAM WAVE, MEGA JUMP, SPIRAL CHEER

---

## Performance (HD / LITE)

Toggle via the HD/LITE button in the menu top bar.

| Feature | HD | LITE |
|---|---|---|
| DPR cap | 2 (desktop) / 1.25 (mobile) | 1.0 |
| FPS target | 60 | 45 |
| Max crowd | 280 | 220 |
| Particle pool | 24 | 14 |

Auto-detection suggests LITE on devices with ≤4GB RAM, ≤4 cores, narrow screen, or ≥3x pixel ratio.

---

## File Structure

```
index.html                        -- Main HTML (all screens, DOM elements)
css/
  00-base-hud-screens.css         -- HUD, progress bar, float text, phase flash, milestones
  10-meta-shop.css                -- Menu shell, shop, skin cards, side actions
  20-skins-textures-fx.css        -- Skin textures, procedural patterns, hero panel
  30-skin-fx-overrides.css        -- Skin FX overrides
  40-content-missions-chest-world.css -- Missions, chest, content cards
  50-stable-performance-final-polish.css -- Performance flags
  60-responsive-devtools-v87.css  -- Responsive layout, dev tools
  90-late-overrides.css           -- Late-stage CSS overrides
js/
  core/game.js                    -- Complete game logic (7344 lines, single file)
  ui/mobile-bottom-dock.js        -- Mobile dock, space map UI (412 lines)
```

---

## How to Run

```bash
python -m http.server 8000
```

Open `http://localhost:8000` in a browser (Chrome, Firefox, Edge, Safari).

All data saves to `localStorage`. No backend required.

---

## Economy

- **Coins** are the only currency
- Earned from: runs, next-run goals, missions, daily rewards, daily challenges, boss chests, world unlocks, fever rewards, comeback bonuses
- Spent on: purchasing skins
- Win reward formula: `85 + level*14 + sqrt(survivors)*7.6 + log10 bonus + 90`
- Fail reward formula: `32 + level*5 + sqrt(survivors)*2.9`
- Consecutive win streaks multiply the run reward bonus: 2 wins = x1.05, 3 = x1.10, scaling to x1.25

---

## Difficulty Curve

Scales with player level: speed ramps up, gate spacing compresses, obstacles get harder, boss gets stronger. Progressive introduction:
- Level 1: Only good/bad gates
- Level 2: Obstacles introduced
- Level 3: Boss Reflex unlocked
- Level 4: Forced items
- Level 5: DANGER gates
- Level 6+: Full run

---

## Dev Tools

Press **F2** or **backtick (`)** to open the dev panel. Features: set level/coins/crowd, unlock all skins, skip to boss/win/lose, apply world themes, reset save.
