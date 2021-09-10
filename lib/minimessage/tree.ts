import type { Token } from './lexer';
import { MinecraftComponent } from '../component/minecraft';
import { text } from '../component/text';
import { TokenType } from './lexer';
import { Transformations } from './transformation/transformation';
import { Insertions } from './transformation/insertion';
import { findApplicable } from './transformation/applicable';

interface ComponentNode {
  component: MinecraftComponent;
  value: string;
}

export function tree(
  message: string,
  tokens: readonly Token[]
): MinecraftComponent {
  let current: MinecraftComponent = text('');
  let start = false;
  const root = current;
  const stack: ComponentNode[] = [{ component: current, value: '' }];
  for (const token of tokens) {
    switch (token.type) {
      case TokenType.TEXT: {
        current.text += value(message, token);
        break;
      }
      case TokenType.OPEN_TAG: {
        start = token.end - token.start === 1;
        break;
      }
      case TokenType.TAG_VALUE: {
        const val = value(message, token);
        const [name, ...args] = val.split(':');
        if (!start) {
          const removed = findTagBalance(name, stack);
          if (removed.length) {
            current = stack[stack.length - 1].component;
            if (!('extra' in current)) {
              current.extra = [];
            }
            const component = text('');
            current.extra!.push(component);
            current = component;
          } else {
            current.text += '</' + name + '>';
          }
          break;
        }
        const insertion = findApplicable(Insertions, name);
        if (insertion) {
          const component = insertion.apply(name, args);
          const text2 = text('');
          component.extra = [text2];
          current.extra = [component];
          current = text2;
          continue;
        }
        const transformation = findApplicable(Transformations, name);
        if (transformation) {
          try {
            const component = text('');
            transformation.apply(component, name, args);
            current.extra = [component];
            current = component;
            stack.push({ component: current, value: name });
          } catch (e) {
            console.error(e);
            current.text += '<' + val + '>';
          }
        } else {
          current.text += '<' + val + '>';
        }
      }
    }
  }
  return root;
}

function findTagBalance(
  value: string,
  stack: ComponentNode[]
): ComponentNode[] {
  for (let i = stack.length - 1; i >= 0; i--) {
    if (stack[i].value === value) {
      return stack.splice(i);
    }
  }
  return new Array(0);
}

const value = (message: string, token: Token): string =>
  message.substring(token.start, token.end);
