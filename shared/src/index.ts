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
export { PLAYER_A_WIN, PLAYER_B_WIN, MILITARY_TOKEN_CENTER } from './militaryTokens/types.js';
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

export { applyInitialFaceUp, revealAfterTake } from './_gameLogic/setup/structureFaceUp.js';
export type { Rng } from './_utility/rng.js';
export { createMathRng } from './_utility/rng.js';
export { toGameStateView } from './_utility/toGameStateView.js';
export { toPlayerView } from './_utility/toPlayerView.js';

export { dealAgeCardIds } from './_gameLogic/setup/dealAgeCardIds.js';
export { buildStructure } from './_gameLogic/setup/buildStructure.js';
export { setupAge } from './_gameLogic/setup/setupAge.js';
export { dealProgressTokens } from './_gameLogic/setup/dealProgressTokens.js';
export type { CreateInitialGameStateParams } from './_gameLogic/setup/createInitialGameState.js';
export { createInitialGameState } from './_gameLogic/setup/createInitialGameState.js';

export type { BuildStructureCardResult } from './_gameLogic/building/buildingCards/getStructureCardBuildCost.js';
export { getStructureCardBuildCost } from './_gameLogic/building/buildingCards/getStructureCardBuildCost.js';

export type { BuildWonderResult } from './_gameLogic/building/buildingWonders/getWonderBuildCost.js';
export { getWonderBuildCost } from './_gameLogic/building/buildingWonders/getWonderBuildCost.js';

export { canPlayerAct } from './_gameLogic/playerMove/utility/canPlayerAct.js';
export { isSlotAccessible } from './_gameLogic/utility/isSlotAccessible.js';
export { getDiscardCoins } from './_gameLogic/getDiscardCoins/getDiscardCoins.js';

export type { ApplyError, ApplyResult } from './_gameLogic/playerMove/types.js';
export { applyDiscardCard } from './_gameLogic/playerMove/turn/applyDiscardCard.js';
export { applyBuildCard } from './_gameLogic/playerMove/turn/applyBuildCard.js';
export { applyBuildWonder } from './_gameLogic/playerMove/turn/applyBuildWonder.js';
export { applyChooseProgressToken } from './_gameLogic/playerMove/choice/applyChooseProgressToken.js';
export { applyChooseProgressFromBox } from './_gameLogic/playerMove/choice/applyChooseProgressFromBox.js';
export { applyDiscardOpponentCard } from './_gameLogic/playerMove/choice/applyDiscardOpponentCard.js';
export { applyConstructFromDiscard } from './_gameLogic/playerMove/choice/applyConstructFromDiscard.js';
