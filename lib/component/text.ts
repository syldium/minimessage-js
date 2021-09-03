import type { Component, MinecraftComponent } from './minecraft';

export interface TextComponent extends Component {
  text: string;
}

export const text = (text: string): TextComponent => ({ text });

export const isText = (
  component: MinecraftComponent
): component is TextComponent => 'text' in component;
