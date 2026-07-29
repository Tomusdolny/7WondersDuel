/**
 * Jednorazowe wycinanie ikon z workplan/game_photos do frontend/public/images/icons.
 * Uruchom: node scripts/extract-game-icons.mjs
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'workplan', 'game_photos');
const out = path.join(root, 'frontend', 'public', 'images', 'icons');
const progressOut = path.join(out, 'progress');

fs.mkdirSync(progressOut, { recursive: true });

async function extract(input, region, dest) {
  await sharp(path.join(src, input))
    .extract(region)
    .png()
    .toFile(path.join(out, dest));
  console.log('wrote', dest, region);
}

async function copy(input, dest) {
  await sharp(path.join(src, input)).png().toFile(path.join(out, dest));
  console.log('copied', dest);
}

// resources.png 170x68 — 3 kolumny, ikony w dolnej części (bez etykiet)
// glina | drewno | kamień
{
  const w = 170;
  const h = 68;
  const cols = 3;
  const colW = Math.floor(w / cols);
  const top = 18;
  const names = ['clay.png', 'wood.png', 'stone.png'];
  for (let i = 0; i < cols; i++) {
    await extract('resources.png', {
      left: i * colW,
      top,
      width: i === cols - 1 ? w - i * colW : colW,
      height: h - top,
    }, names[i]);
  }
}

// goods.png 113x73 — szkło | papirus
{
  const w = 113;
  const h = 73;
  const cols = 2;
  const colW = Math.floor(w / cols);
  const top = 18;
  const names = ['glass.png', 'papyrus.png'];
  for (let i = 0; i < cols; i++) {
    await extract('goods.png', {
      left: i * colW,
      top,
      width: i === cols - 1 ? w - i * colW : colW,
      height: h - top,
    }, names[i]);
  }
}

await copy('money.png', 'coin.png');
await copy('victory_point.png', 'vp.png');
await copy('shields.png', 'shield.png');

// buildings_symbols.png 339x83 — 2 rzędy
// rząd 1 (8): amphora, barrel, mask, temple*, sun*, drop, column, moon
// rząd 2 (9): target, helmet, horseshoe, sword, tower, harp, gear, book, lamp
{
  const w = 339;
  const h = 83;
  const rowH = Math.floor(h / 2);
  const topRow = [
    'chain-amphora.png',
    'chain-barrel.png',
    'chain-mask.png',
    null, // temple — poza ChainSymbol
    null, // sun — poza ChainSymbol
    'chain-drop.png',
    'chain-column.png',
    'chain-moon.png',
  ];
  const bottomRow = [
    'chain-target.png',
    'chain-helmet.png',
    'chain-horseshoe.png',
    'chain-sword.png',
    'chain-tower.png',
    'chain-harp.png',
    'chain-gear.png',
    'chain-book.png',
    'chain-lamp.png',
  ];

  async function row(names, top) {
    const cols = names.length;
    const colW = Math.floor(w / cols);
    for (let i = 0; i < cols; i++) {
      const name = names[i];
      if (!name) continue;
      await extract('buildings_symbols.png', {
        left: i * colW,
        top,
        width: i === cols - 1 ? w - i * colW : colW,
        height: rowH,
      }, name);
    }
  }

  await row(topRow, 0);
  await row(bottomRow, rowH);
}

// science_tokens.png 480x67 — 7 ikon L→R
// astronomy, law, sundial, chemistry, math, writing, wheel
{
  const w = 480;
  const h = 67;
  const names = [
    'science-astronomy.png',
    'science-law.png',
    'science-sundial.png',
    'science-chemistry.png',
    'science-math.png',
    'science-writing.png',
    'science-wheel.png',
  ];
  const cols = names.length;
  const colW = Math.floor(w / cols);
  for (let i = 0; i < cols; i++) {
    await extract('science_tokens.png', {
      left: i * colW,
      top: 0,
      width: i === cols - 1 ? w - i * colW : colW,
      height: h,
    }, names[i]);
  }
}

const progressMap = {
  'architectura_token.png': 'architecture.png',
  'budownictwo_token.png': 'masonry.png',
  'ekonomia_token.png': 'economy.png',
  'filozofia_token.png': 'philosophy.png',
  'matematyka_token.png': 'mathematics.png',
  'prawo_token.png': 'law.png',
  'rolnictwo_token.png': 'agriculture.png',
  'strategia_token.png': 'strategy.png',
  'teologia_token.png': 'theology.png',
  'urbanistyka_token.png': 'urbanism.png',
};

for (const [from, to] of Object.entries(progressMap)) {
  await sharp(path.join(src, from))
    .png()
    .toFile(path.join(progressOut, to));
  console.log('copied progress/' + to);
}

console.log('done');
