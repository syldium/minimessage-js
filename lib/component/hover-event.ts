import type { MinecraftComponent } from './minecraft';
import { text } from './text';

export interface HoverEventShowText {
  action: 'show_text';
  value: MinecraftComponent;
}

export interface HoverEventShowItem {
  action: 'show_item';
  value: string;
}

export interface DeserializedItem {
  id: string;
  count?: string;
}

export type HoverEvent = HoverEventShowText | HoverEventShowItem;

export function findHoverComponent(event: HoverEvent): MinecraftComponent {
  switch (event.action) {
    case 'show_text':
      return event.value;
    case 'show_item':
      return text((JSON.parse(event.value) as DeserializedItem).id);
  }
}
