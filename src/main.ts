import './style.css';
import { renderComponentAsElement } from '../lib/renderComponentAsElement';
import { parseMiniMessage } from '../lib/minimessage/parser';

const pre = document.querySelector('pre') as HTMLPreElement;
const text = document.querySelector('textarea') as HTMLTextAreaElement;
function render() {
  const message = text.value;
  while (pre.firstChild) pre.firstChild.remove();
  pre.append(renderComponentAsElement(parseMiniMessage(message)));
}
text.addEventListener('input', render);
render();
