export enum TokenType {
  TEXT,
  OPEN_TAG,
  CLOSE_TAG,
  TAG_VALUE
}

export interface Token {
  start: number;
  end: number;
  type: TokenType;
}

export function lexer(message: string): Token[] {
  const tokens: Token[] = [];
  let escape = false; // If the next character should be escaped
  let tag = false; // If we may be in a tag
  let literal = false; // If we may be in a string literal
  let literalDelimiter = '"'; // The current literal delimiter
  let tokenStart = -1;
  let tokenEnd = -1;

  for (let pos = 0; pos < message.length; pos++) {
    const char = message.charAt(pos);
    if (escape) {
      escape = false;
    } else if (char === '\\') {
      escape = true;
    } else if (literal) {
      if (char === literalDelimiter) {
        literal = false;
      }
    } else if (!tag && char === '<') {
      tokenStart = pos;
      tag = true;
    } else if (tag) {
      if (char === '"' || char === "'") {
        // Start of a literal
        literalDelimiter = char;
        literal = true;
        continue;
      }
      if (char !== '>') {
        continue;
      }
      if (pos === tokenStart + 1 || message.charAt(pos - 1) === '/') {
        // Tag without content (<> or </>)
        tag = false;
        continue;
      }
      if (tokenStart !== tokenEnd + 1) {
        tokens.push({
          start: tokenEnd + 1,
          end: tokenStart,
          type: TokenType.TEXT
        });
      }

      // The three parts of the tag exist
      const isClosingTag = message.charAt(tokenStart + 1) === '/';
      const valuePos = tokenStart + (isClosingTag ? 2 : 1);
      tokens.push({
        start: tokenStart,
        end: valuePos,
        type: TokenType.OPEN_TAG
      });
      tokens.push({ start: valuePos, end: pos, type: TokenType.TAG_VALUE });
      tokens.push({ start: pos, end: pos + 1, type: TokenType.CLOSE_TAG });
      tokenEnd = pos;
      tag = false;
    }
  }

  // The rest is text
  if (tokenEnd !== message.length - 1) {
    tokens.push({
      start: tokenEnd + 1,
      end: message.length,
      type: TokenType.TEXT
    });
  }
  return tokens;
}

type Element = [string, TokenType];

export function createTokens(...elements: Element[]): Token[] {
  let pos = 0;
  const tokens: Token[] = [];
  for (const [content, type] of elements) {
    tokens.push({ start: pos, end: pos + content.length, type });
    pos += content.length;
  }
  return tokens;
}

export function createTagElements(
  value: string,
  closing: boolean
): [Element, Element, Element] {
  return [
    [closing ? '</' : '<', TokenType.OPEN_TAG],
    [value, TokenType.TAG_VALUE],
    ['>', TokenType.CLOSE_TAG]
  ];
}

export function compareTokens(a: Token, b: Token): boolean {
  return a.start === b.start && a.end === b.end && a.type === b.type;
}
