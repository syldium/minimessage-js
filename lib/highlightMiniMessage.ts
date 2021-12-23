import { lexer, Token, TokenType } from './minimessage/lexer';

export function highlightMiniMessage(
  text: string,
  highlight: HTMLElement
): void {
  while (highlight.firstChild) {
    highlight.removeChild(highlight.firstChild);
  }
  for (const token of lexer(text)) {
    const nodes = createTextNodes(text, token);
    if (token.type == TokenType.TEXT) {
      highlight.append(...createTextNodes(text, token));
    } else if (token.type == TokenType.TAG_VALUE) {
      highlight.appendChild(createTokenElement(nodes, 'tag-name'));
    } else {
      highlight.appendChild(createTokenElement(nodes, 'punctuation'));
    }
  }
  if (text.length && text[text.length - 1] == '\n') {
    highlight.appendChild(document.createElement('br'));
  }
}

function* createTextNodes(text: string, token: Token): Generator<Node> {
  let first = true;
  for (const content of text.substring(token.start, token.end).split('\n')) {
    if (!first) {
      yield document.createElement('br');
    }
    first = false;
    yield document.createTextNode(content);
  }
}

function createTokenElement(
  text: IterableIterator<Node>,
  type: string
): HTMLSpanElement {
  const span = document.createElement('span');
  span.append(...text);
  span.classList.add('token', type);
  return span;
}
