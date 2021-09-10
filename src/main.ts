import './style.css';
import { renderComponentAsElement } from '../lib/renderComponentAsElement';
import { parseMiniMessage } from '../lib/minimessage/parser';

const pre = document.querySelector('pre') as HTMLPreElement;
const text = document.querySelector('textarea') as HTMLTextAreaElement;
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
}
text.addEventListener('input', render);
render();
