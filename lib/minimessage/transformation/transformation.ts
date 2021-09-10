import { isNamedColor } from '../../component/named-text-color';
import { parseMiniMessage } from '../parser';
import type { MinecraftComponent } from '../../component/minecraft';
import type { ComponentDecoration } from '../../component/minecraft';
import type { Applicable } from './applicable';

export interface TextTransformation extends Applicable {
  apply: (
    component: MinecraftComponent,
    name: string,
    args: readonly string[]
  ) => void;
}

const color = ['color', 'colour', 'c'];
export const ColorTransformation: TextTransformation = {
  applicable: (name) =>
    color.includes(name) ||
    /^#[0-9A-F]{1,6}$/i.test(name) ||
    isNamedColor(name),
  apply: (component, name, args) => {
    if (color.includes(name)) {
      if (args.length === 1) {
        name = args[0];
      } else {
        throw Error('Unsupported color');
      }
    }

    if (name.startsWith('#')) {
      component.color = '#' + name.substr(1).padStart(6, '0');
    } else {
      component.color = name;
    }
  }
};

function parseDecoration(name: string): keyof ComponentDecoration | null {
  switch (name) {
    case 'b':
    case 'bold':
      return 'bold';
    case 'i':
    case 'em':
    case 'italic':
      return 'italic';
    case 'u':
    case 'underlined':
      return 'underlined';
    case 'st':
    case 'strikethrough':
      return 'strikethrough';
    case 'obf':
    case 'obfuscated':
      return 'obfuscated';
  }
  return null;
}

export const DecorationTransformation: TextTransformation = {
  applicable: (name) => parseDecoration(name) !== null,
  apply: (component, name) => {
    component[parseDecoration(name)!] = true;
  }
};

export const HoverTransformation: TextTransformation = {
  applicable: (name) => name === 'hover',
  apply: (component, _name, args) => {
    if (args.length !== 2 || args[0] !== 'show_text') {
      throw Error('Unsupported hover event');
    }
    component.hover = {
      action: 'show_text',
      value: parseMiniMessage(args[1].substring(1, args[1].length - 1))
    };
  }
};

export const Transformations: readonly TextTransformation[] = [
  ColorTransformation,
  DecorationTransformation,
  HoverTransformation
];
