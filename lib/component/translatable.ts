import type { Component, MinecraftComponent } from './minecraft';

export interface TranslatableComponent extends Component {
  translate: string;
  with?: MinecraftComponent[];
}

export const translatable = (
  translate: string,
  args?: MinecraftComponent[]
): TranslatableComponent => ({ translate, with: args });

export const isTranslatable = (
  component: MinecraftComponent
): component is TranslatableComponent => 'translate' in component;
