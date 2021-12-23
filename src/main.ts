import './style.css';
import { renderComponentAsElement } from '../lib/renderComponentAsElement';
import { parseMiniMessage } from '../lib/minimessage/parser';
import { highlightMiniMessage } from '../lib/highlightMiniMessage';

const pre = document.querySelector('#output') as HTMLPreElement;
const text = document.querySelector(
  '#minimessage-string'
) as HTMLTextAreaElement;
const highlighting = document.querySelector(
  '#minimessage-highlighting-content'
) as HTMLElement;
const translations: Record<string, string> = {
  demo: 'translated',
  test: 'translated'
};
function render() {
  const message = text.value;
  while (pre.firstChild) pre.firstChild.remove();
  pre.append(
    renderComponentAsElement(parseMiniMessage(message), {
      translate: async (name: string) => translations[name] || name
    })
  );
  highlightMiniMessage(message, highlighting);
  updateScroll();
}
function updateScroll() {
  highlighting.parentElement!.scrollTop = text.scrollTop;
  highlighting.parentElement!.scrollLeft = text.scrollLeft;
}
text.addEventListener('input', render);
text.addEventListener('scroll', updateScroll);
render();
