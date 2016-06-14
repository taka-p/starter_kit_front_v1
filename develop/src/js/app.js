import Al from './helper/alias.js';
import $ from '../../../bower_components/jquery/dist/jquery';

window.onload = () => {
  const dom = Al.getId('dom');
  dom.innerHTML = 'Hello World!';
  const $dom = dom;
  console.log($dom);
};
