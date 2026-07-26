export type { Resource, ScienceSymbol } from './resources.js';
export { RESOURCES } from './resources.js';

export type {
  Age,
  Card,
  CardColor,
  CardId,
  ChainSymbol,
  Cost,
  BrownCard,
  GreyCard,
  BlueCard,
  GreenCard,
  YellowCard,
  RedCard,
  PurpleCard,
  YellowEffect,
  GuildScoring,
} from './ageCards/types.js';
export { AGE_1_CARDS, AGE_2_CARDS, AGE_3_CARDS, GUILD_CARDS, ALL_CARDS } from './ageCards/cards.js';

export type { WonderId, WonderCard, WonderEffect } from './wonders/types.js';
export { WONDER_CARDS } from './wonders/wonders.js';

export type { ProgressTokenId, ProgressToken, ProgressEffect } from './progressTokens/types.js';
export { PROGRESS_TOKENS } from './progressTokens/tokens.js';

export type { ConflictPosition, MilitaryToken } from './militaryTokens/types.js';
export {
  PLAYER_A_WIN,
  PLAYER_B_WIN,
  MILITARY_TOKEN_CENTER,
} from './militaryTokens/types.js';
export { MILITARY_TOKENS } from './militaryTokens/tokens.js';

export type {
  PlayerId,
  PlayerState,
  PlayerWonderSlot,
  ProductionSnapshot,
  TradeDiscountSnapshot,
} from './state/player.js';
export type {
  GameResult,
  EffectPendingChoice,
  GamePhase,
  GameState,
  GameStateView,
} from './state/game.js';
export type {
  TakenSlot,
  StructureSlot,
  StructureSlotPublic,
  FaceDownSlot,
  Structure,
  StructurePublic,
} from './structure/types.js';

export { applyInitialFaceUp, revealAfterTake } from './_utility/structureFaceUp.js';
export { toGameStateView } from './_utility/toGameStateView.js';

export type { BuildStructureCardResult } from './_gameLogic/buildingCards/getStructureCardBuildCost.js';
export { getStructureCardBuildCost } from './_gameLogic/buildingCards/getStructureCardBuildCost.js';

export type { BuildWonderResult } from './_gameLogic/buildingWonders/getWonderBuildCost.js';
export { getWonderBuildCost } from './_gameLogic/buildingWonders/getWonderBuildCost.js';
