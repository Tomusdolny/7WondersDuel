export type { Resource, ScienceSymbol } from './resources.js';

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
  TakenSlot,
  StructureSlot,
  GameResult,
  EffectPendingChoice,
  GamePhase,
  GameState,
} from './state/game.js';

export {
  PROTOCOL_VERSION,
  type ProtocolVersion,
  type TakeCardAction,
  type CreateRoomCommand,
  type JoinRoomCommand,
  type SelectWonderCommand,
  type TakeCardCommand,
  type ChooseProgressTokenCommand,
  type DiscardOpponentCardCommand,
  type ConstructFromDiscardCommand,
  type ChooseNextAgeStarterCommand,
  type ClientCommand,
  type ClientMessage,
  type RoomStatus,
  type RoomStateEvent,
  type GameStateViewEvent,
  type CommandRejectCode,
  type CommandRejectedEvent,
  type PlayerScoreBreakdown,
  type GameEndedEvent,
  type ServerEvent,
  type ServerMessage,
  type StructureSlotView,
  type LegalSlotAction,
  type GameStateView,
} from './events/index.js';
