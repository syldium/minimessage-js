import type { MinecraftComponent } from '../component/minecraft';
import { tree } from './tree';
import { lexer } from './lexer';

export const parseMiniMessage = (message: string): MinecraftComponent =>
  tree(message, lexer(message));
