import { tree } from '../lib/minimessage/tree';
import {
  createTagElements,
  createTokens,
  TokenType
} from '../lib/minimessage/lexer';
import { describe, expect, it } from 'vitest';

// We do not test tags that follow each other here since the output is not flattened.
describe('tree', function () {
  it('should color after the tag', () => {
    const component = tree(
      'some <green>colored text',
      createTokens(
        ['some ', TokenType.TEXT],
        ...createTagElements('green', false),
        ['colored text', TokenType.TEXT]
      )
    );
    expect(component).toEqual({
      text: 'some ',
      extra: [{ color: 'green', text: 'colored text' }]
    });
  });

  it('should handle closing tags', () => {
    const component = tree(
      'A <bold>very</bold> important text to read!',
      createTokens(
        ['A ', TokenType.TEXT],
        ...createTagElements('bold', false),
        ['very', TokenType.TEXT],
        ...createTagElements('bold', true),
        [' important text to read!', TokenType.TEXT]
      )
    );
    expect(component).toEqual({
      text: 'A ',
      extra: [
        { bold: true, text: 'very' },
        { text: ' important text to read!' }
      ]
    });
  });

  it('should close nested tags implicitly', () => {
    const component = tree(
      'Some <dark_blue>news from <em>all around</dark_blue> the world.',
      createTokens(
        ['Some ', TokenType.TEXT],
        ...createTagElements('dark_blue', false),
        ['news from ', TokenType.TEXT],
        ...createTagElements('em', false),
        ['all around', TokenType.TEXT],
        ...createTagElements('dark_blue', true),
        [' the world.', TokenType.TEXT]
      )
    );
    expect(component).toEqual({
      text: 'Some ',
      extra: [
        {
          color: 'dark_blue',
          text: 'news from ',
          extra: [{ italic: true, text: 'all around' }]
        },
        { text: ' the world.' }
      ]
    });
  });
});
