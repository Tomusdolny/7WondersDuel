import type {
  CardColor,
  ChainSymbol,
  Resource,
  ScienceSymbol,
} from '@7ww/shared';

const ICONS = '/images/icons';

export const RESOURCE_ICON: Record<Resource, string> = {
  clay: `${ICONS}/clay.png`,
  wood: `${ICONS}/wood.png`,
  stone: `${ICONS}/stone.png`,
  glass: `${ICONS}/glass.png`,
  papyrus: `${ICONS}/papyrus.png`,
};

export const CHAIN_ICON: Record<ChainSymbol, string> = {
  mask: `${ICONS}/chain-mask.png`,
  moon: `${ICONS}/chain-moon.png`,
  drop: `${ICONS}/chain-drop.png`,
  amphora: `${ICONS}/chain-amphora.png`,
  barrel: `${ICONS}/chain-barrel.png`,
  horseshoe: `${ICONS}/chain-horseshoe.png`,
  sword: `${ICONS}/chain-sword.png`,
  tower: `${ICONS}/chain-tower.png`,
  target: `${ICONS}/chain-target.png`,
  helmet: `${ICONS}/chain-helmet.png`,
  book: `${ICONS}/chain-book.png`,
  gear: `${ICONS}/chain-gear.png`,
  harp: `${ICONS}/chain-harp.png`,
  lamp: `${ICONS}/chain-lamp.png`,
  column: `${ICONS}/chain-column.png`,
};

export const SCIENCE_ICON: Record<ScienceSymbol, string> = {
  writing: `${ICONS}/science-writing.png`,
  wheel: `${ICONS}/science-wheel.png`,
  math: `${ICONS}/science-math.png`,
  chemistry: `${ICONS}/science-chemistry.png`,
  sundial: `${ICONS}/science-sundial.png`,
  astronomy: `${ICONS}/science-astronomy.png`,
  law: `${ICONS}/science-law.png`,
};

export const COIN_ICON = `${ICONS}/coin.png`;
export const VP_ICON = `${ICONS}/vp.png`;
export const SHIELD_ICON = `${ICONS}/shield.png`;

export const CARD_COLOR_BG: Record<CardColor, string> = {
  brown: '#8b5e34',
  grey: '#7a828e',
  blue: '#3d6fa8',
  green: '#3f7a4f',
  yellow: '#c9a03a',
  red: '#a83d2f',
  purple: '#6b3d7a',
};

export const RESOURCE_LABEL: Record<Resource, string> = {
  clay: 'glina',
  wood: 'drewno',
  stone: 'kamień',
  glass: 'szkło',
  papyrus: 'papirus',
};
