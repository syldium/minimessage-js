import type { Component, MinecraftComponent } from './component/minecraft';
import { isText } from './component/text';
import { isNamedColor, NamedTextColor } from './component/named-text-color';
import { findHoverComponent } from './component/hover-event';

export function renderComponentAsElement(component: MinecraftComponent): Element {
  const el = document.createElement('span');
  createStyle(component, el.style);
  if (isText(component)) {
    el.appendChild(document.createTextNode(component.text));
  }
  if (component.hover) {
    el.classList.add('hover-source');
    const hover = renderComponentAsElement(findHoverComponent(component.hover));
    hover.classList.add('hover');
    el.appendChild(hover);
  }
  if (component.extra) {
    component.extra.forEach((child) => el.appendChild(renderComponentAsElement(child)));
  }
  return el;
}

function createStyle(component: Component, style: CSSStyleDeclaration): void {
  if (component.color) {
    style.color = asCssColor(component.color);
  }
  if (component.bold) {
    style.fontWeight = 'bold';
  }
  if (component.italic) {
    style.fontStyle = 'italic';
  }
  let decoration = '';
  if (component.strikethrough) {
    decoration += 'line-through';
  }
  if (component.underlined) {
    decoration += ' underline';
  }
  style.textDecoration = decoration;
}

function asCssColor(color: string): string {
  if (isNamedColor(color)) {
    return '#' + NamedTextColor[color].toString(16).padStart(6, '0');
  }
  return color;
}
