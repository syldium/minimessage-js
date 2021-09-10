import type { TextComponent } from './text';
import type { HoverEvent } from './hover-event';
import type { TranslatableComponent } from './translatable';

export interface ComponentApparence {
  color: string;
  font: string;
}

export interface ComponentDecoration {
  bold: boolean;
  italic: boolean;
  underlined: boolean;
  strikethrough: boolean;
  obfuscated: boolean;
}

export interface ComponentInteraction {
  insertion: string;
  hover: HoverEvent;
}

export interface Component
  extends Partial<ComponentApparence>,
    Partial<ComponentDecoration>,
    Partial<ComponentInteraction> {
  extra?: MinecraftComponent[];
}

export type MinecraftComponent = TextComponent | TranslatableComponent;
