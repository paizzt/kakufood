# Design Direction: Kaku Food Inventory

## Identity & Purpose
A no-nonsense, functional internal dashboard for Kaku Food staff to manage and monitor their F&B equipment across branches. 

## Dials
- **ENERGY:** 1 (Calm, focused on data, like GOV.UK or standard Bootstrap)
- **RHYTHM:** 1 (Predictable, consistent tables and lists, no unexpected layouts)
- **MOTION:** 1 (Hover states only on rows and buttons. No scroll reveals or bounces)

## Typography
- System fonts (Bootstrap default) for maximum readability and speed. No decorative fonts.

## Palette
- **Primary:** Bootstrap Primary Blue (for primary actions like 'Simpan' or main links)
- **Neutral:** White backgrounds, light grey borders (`border-light` or `shadow-sm`), dark grey text.
- **Status Accents:** 
  - Red/Danger: Rusak Berat, Ditolak
  - Yellow/Warning: Rusak Ringan
  - Green/Success: Aktif, Baik, Selesai

## Patterns to Avoid (Anti Slop)
- No glassmorphism, glows, or excessive border radius.
- No "AI" icons (sparkles, robots) or emoji in UI text.
- Empty states must provide a reason and next action, not just "No data".
- No fake dashboard cards with invented numbers (only real DB data).
