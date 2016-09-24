/* config */

export default {
  // js config
  jsFileName   : 'app.js', // 基点ファイル名(小規模であれば処理もまとめる)
  jsDestDirDev : './develop/build/js', // 出力先ディレクトリ
  jsDestDirProd: './product/js',
  jsSrcDir     : './develop/src/js', // リソース格納ディレクトリ
  jsSrc        : './develop/src/js/**/*.js',
  jsUglifyDev  : false, // テストでuglifyする場合はtrue
  jsUglifyProd : true,  // テストでuglifyしない場合はfalse
  jsGzipProd   : true,  // テストでuglifyしない場合はfalse

  // css config
  cssDestDirDev : './develop/build/css/',
  cssDestDirProd: './product/css/',
  cssSrc        : './develop/src/scss/**/*.scss',
  cssNanoDev    : false, // テストでcssnanoする場合はtrue
  cssNanoProd   : true,  // テストでcssnanoしない場合はfalse
  cssGzipProd   : true,  // テストでcssnanoしない場合はfalse
  browsers: [
    // doiuse,autoprefixer設定 - https://github.com/ai/browserslist#queries
    // 国内端末シェア - http://smatabinfo.jp/index.html
    'last 2 version',
    'ios >= 5',
    'android >= 4'
  ],
  ignores: [
    // doiuse設定から弾く
    'background-img-opts'
  ],

  // img config
  imgSrcDir      : './develop/build/img',
  imgDestDirProd : './product/img',

  // sprite config
  spriteSrc   : './develop/src',
  spriteDest  : './develop/build',
  spriteScss  : 'scss',
  spriteImg   : 'img',
  spriteName  : 'sprite',

  // svg config
  svgBaseDir : './develop/build/img/svg'
};
