import Al from './helper/alias.js';

window.onload = function() {
    const dom = Al.getId('dom');
    dom.innerHTML = 'Hello World!';
    console.log(dom);
};
