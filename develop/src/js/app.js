import Al    from './helper/alias.js';
import Valid from './component/validation';
import $ from '../../../bower_components/jquery/dist/jquery.min';

window.onload = () => {
  const dom = Al.getId('dom');
  dom.innerHTML = 'Hello World!';
  const $dom = dom;
  console.log($dom);

  const listEach = [].forEach.bind(Al.getTag('input'));
  listEach(item => {
    new Valid(item);
  });
  // [].forEach().apply(Al.getTag('input'));
};
