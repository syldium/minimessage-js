export const NamedTextColor = {
  black: 0x000000,
  dark_blue: 0x0000aa,
  dark_green: 0x00aa00,
  dark_aqua: 0x00aaaa,
  dark_red: 0xaa0000,
  dark_purple: 0xaa00aa,
  gold: 0xffaa00,
  gray: 0xaaaaaa,
  dark_gray: 0x555555,
  blue: 0x5555ff,
  green: 0x55ff55,
  aqua: 0x55ffff,
  red: 0xff5555,
  light_purple: 0xff55ff,
  yellow: 0xffff55,
  white: 0xffffff
};

export const isNamedColor = (
  value: string
): value is keyof typeof NamedTextColor => value in NamedTextColor;
