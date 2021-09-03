import { diff } from 'jest-diff';
import {
  compareTokens,
  createTagElements,
  createTokens,
  lexer,
  Token,
  TokenType
} from '../lib/minimessage/lexer';

interface TokenOutput {
  start: number;
  end: number;
  content: string;
  type: keyof typeof TokenType;
}

function format(tokens: readonly Token[], message: string): TokenOutput[] {
  return tokens.map(({ start, end, type }) => ({
    start,
    end,
    content: message.substring(start, end),
    type: TokenType[type] as keyof typeof TokenType
  }));
}

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeSameTokens(expected: readonly Token[]): R;
    }
  }
}

expect.extend({
  toBeSameTokens(
    input: string,
    expected: readonly Token[]
  ): jest.CustomMatcherResult {
    const received = lexer(input);
    const pass =
      Array.isArray(received) &&
      expected.length === received.length &&
      expected.every((token: Token, index: number) =>
        compareTokens(token, received[index])
      );
    const message = function (): string {
      if (pass) {
        return '';
      }
      return diff(format(expected, input), format(received, input))!;
    };
    return {
      message,
      pass
    };
  }
});

describe('lexer', function () {
  it('should separate tokens from tags', () => {
    expect("It's <blue>colored").toBeSameTokens([
      { start: 0, end: 5, type: TokenType.TEXT },
      { start: 5, end: 6, type: TokenType.OPEN_TAG },
      { start: 6, end: 10, type: TokenType.TAG_VALUE },
      { start: 10, end: 11, type: TokenType.CLOSE_TAG },
      { start: 11, end: 18, type: TokenType.TEXT }
    ]);
  });

  it('should not find any text nodes', () => {
    expect('<aqua><red></gray>').toBeSameTokens(
      createTokens(
        ...createTagElements('aqua', false),
        ...createTagElements('red', false),
        ...createTagElements('gray', true)
      )
    );
  });

  it('should treat isolated symbols as text', () => {
    const message = 'yes > no <> maybe </>';
    expect(message).toBeSameTokens([
      { start: 0, end: message.length, type: TokenType.TEXT }
    ]);
  });

  it('should permit escape characters', () => {
    const message = 'no color \\<yellow>';
    expect(message).toBeSameTokens([
      { start: 0, end: message.length, type: TokenType.TEXT }
    ]);
  });

  it('should handle tags in tags', () => {
    expect("<hover:show_text:'<gold>test'>hover me").toBeSameTokens(
      createTokens(
        ['<', TokenType.OPEN_TAG],
        ["hover:show_text:'<gold>test'", TokenType.TAG_VALUE],
        ['>', TokenType.CLOSE_TAG],
        ['hover me', TokenType.TEXT]
      )
    );
  });

  it('should treat unbounded literals as text', () => {
    const message = "<hover:show_text:'<gold>test>hover me";
    expect(message).toBeSameTokens([
      { start: 0, end: message.length, type: TokenType.TEXT }
    ]);
  });
});
