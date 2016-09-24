# スターターキット フロント小規模用
小規模用のフロントエンド開発環境を構築します。
プロジェクトに合わせて適宜カスタマイズして利用して下さい。

## 構成
ルート直下にdevelop, productディレクトリが存在します。
普段はdevelopで開発を行い、リリース時およびデバッグ時にproductにリソース一式をビルドします。

## gulpタスク
### dev - 開発環境用
`gulp dev`で下記のタスクを実行します。

**JS**
- eslintによる構文解析
- BabelによるES6のプリコンパイル
- Webpackによるモジュールの依存解決
- sourcemapの出力

**CSS**
- stylelintによる構文解析
- libsassによるSassプリコンパイル
- postcss-autoprefixerによるベンダープレフィックス付与
- postcss-douiseによるプロパティチェック（ブラウザサポート）
- 拡張子の変更`scss -> css`
- sourcemapの出力

### prod - 本番リリース用
`gulp prod`で下記のタスクを実行します。

**全般**
- `product`ディレクトリを空にする（ゴミファイル対策）

**JS**
- eslintによる構文解析
- BabelによるES6のプリコンパイル
- Webpackによるモジュールの依存解決
- uglify
- concatは行いません（依存解決時にapp.jsで完結しています）
- `product/js/`に配置

**CSS**
- stylelintによる構文解析
- libsassによるSassプリコンパイル
- postcss-autoprefixerによるベンダープレフィックス付与
- 拡張子の変更`scss -> css`
- cssnanoによる最適化(css版のuglify)
- `product/css/`に配置

**画像**
- gulp-imageminによって圧縮(optimizationLevel:7)
- 次のようにコピーされる`develop/build/img/* -> product/img/*`

### sprite - スプライト画像の作成
`gulp sprite`で下記のタスクを実行します。
- `develop/build/img/sprite/**/*.png`を再帰的に読み込む
- 上記で得られた画像群からスプライト画像を生成、スプライト画像はsprite/直下に`dirname.png`という名称で配置される
- スプライト画像を読み込むための変数/関数群は`develop/src/scss/fonundation/variables/sprite/`配下に`_dirname.scss`という名称で配置される
- スプライト画像を利用する際は、事前にimport基点ファイル`app.scss`などに`_dirname.scss`読み込んで利用する

```
@import 'sprite/_test.scss';

.c-ico--github {
    @include r-sprite($github);
}
```

### svg_sprite - svgスプライト画像の作成
`gulp sprite_sprite`で下記のタスクを実行します。
- `develop/build/img/svg/**/*.png`を再帰的に読み込む
- 上記で得られたsvg画像群からスプライト画像を生成、スプライト画像はsvg/直下に`dirname.svg`という名称で配置される
- htmlから`use`タグを利用して読み込むする場合は`fill`属性を指定する事で色を変更可能ですが、cssから`backgroud`プロパティを利用して読み込む場合は色は変更出来ません。

#### htmlから読み込む場合
```html
<svg role="image" class="c-ico__arrow__up">
    <use xlink:href="img/svg/test.svg#svg_1" />
</svg>
```
```css
.c-ico__arrow__up {
    fill: pink;
}
```

#### cssから読み込む場合
```html
<div class="c-ico__arrow__up__svg"></div>
```
```css
.c-ico__arrow__up {
  display: block;
  width: 300px;
  height: 300px;
  background: url(../img/svg/test_2.svg#apple_css);
}
```

## インストール
appは任意のディレクトリ名です。

```
$ git clone git@github.com:taka-p/starter_kit_front_v1.git app
$ cd app
$ npm install
```
