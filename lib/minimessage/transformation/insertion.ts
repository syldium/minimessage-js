import { translatable } from '../../component/translatable';
import { parseMiniMessage } from '../parser';
import type { MinecraftComponent } from '../../component/minecraft';
import type { Applicable } from './applicable';

export interface TextInsertion extends Applicable {
  apply: (name: string, args: readonly string[]) => MinecraftComponent;
}

const translatables = ['lang', 'translatable', 'tr'];
export const TranslatableTransformation: TextInsertion = {
  applicable: (name) => translatables.includes(name),
  apply: (_name, args) => {
    if (!args.length) {
      throw Error('Need a translation key');
    }
    return translatable(args[0], args.slice(1).map(parseMiniMessage));
  }
};

export const Insertions: readonly TextInsertion[] = [
  TranslatableTransformation
];
