import Al    from './helper/alias.js';
import Valid from './component/validation';
import $     from '../../../bower_components/jquery/dist/jquery.min';

window.onload = () => {
  const $rootApp  = $('#rootApp');

  $rootApp.load('./html/partial/_svg_sprite_test.html');

  // $.ajax({
  //   type    : 'GET',
  //   url     : './html/partial/_svg_sprite_test.html',
  //   dataType: 'html',
  //   async   : false
  // }).done((data) => {
  //   $rootApp.html(data);
  //
  //   new $.Deferred().resolve().promise().then(() => {
  //     const rootName = $rootApp.find('#rootSub').attr('data-root-name');
  //
  //     switch (rootName) {
  //       case 'validationTest':
  //         const listEach = [].forEach.bind(Al.getTag('input'));
  //         listEach(item => {
  //           new Valid(item);
  //         });
  //         // [].forEach().apply(Al.getTag('input'));
  //
  //         break;
  //       case 'spriteTest':
  //         break;
  //       case 'svgSpriteTest':
  //         break;
  //       default:
  //         break;
  //     }
  //   })
  // });
};
