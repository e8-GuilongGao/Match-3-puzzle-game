export const TILE_SIZE = 60;
export const GRID_OFFSET_X = 20;
export const GRID_OFFSET_Y = 100;
export const ANIMATION_SPEED = 0.2;

export const COLORS = [
  '#FF4136', // Red
  '#2ECC40', // Green
  '#0074D9', // Blue
  '#B10DC9', // Purple
  '#FF851B', // Orange
  '#7FDBFF', // Cyan
  '#FFDC00', // Yellow
];

export const ALL_FRUITS = [
  '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🥑', '🍆', '🥔', '🥕', '🌽', '🌶️', '🥒', '🥬', '🥦', '🧄', '🧅', '🍄', '🥜', '🌰', '🍞', '🥐', '🥖', '🥨', '🥯', '🥞', '🧇', '🧀', '🍖', '🍗', '🥩', '🥓', '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '🥙', '🧆', '🥚', '🍳', '🥘', '🍲', '🥣', '🥗', '🍿', '🧈', '🧂', '🥫', '🍱', '🍘', '🍙', '🍚', '🍛', '🍜', '🍝', '🍠', '🍢', '🍣', '🍤', '🍥', '🥮', '🍡', '🥟', '🥠', '🥡', '🦀', '🦞', '🦐', '🦑', '🦪', '🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🧁', '🥧', '🍫', '🍬', '🍭', '🍮', '🍯', '🍼', '🥛', '☕', '🍵', '🍶', '🍾', '🍷', '🍸', '🍹', '🍺', '🍻', '🥂', '🥃', '🥤', '🧃', '🧉', '🧊'
];

export const FRUITS = [
  '🍎', // Red
  '🥝', // Green
  '🫐', // Blue
  '🍇', // Purple
  '🍊', // Orange
  '💎', // Cyan (Diamond/Ice)
  '🍋', // Yellow
]; export const GameState = {
  MENU: 0,
  PLAYING: 1,
  ANIMATING: 2,
  LEVEL_COMPLETE: 3,
  GAME_OVER: 4
} as const;
export type GameState = typeof GameState[keyof typeof GameState];