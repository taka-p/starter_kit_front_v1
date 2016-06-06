# スターターキット フロント小規模用
小規模用のフロントエンド開発環境を構築します。
プロジェクトに合わせて適宜カスタマイズして利用して下さい。

## 構成
ルート直下にdevelop, productディレクトリが存在します。
普段はdevelopで開発を行い、リリース時およびデバッグ時にproductにリソース一式をビルドします。

## gulpの設定
### develop
`gulp dev`で下記のタスクを実行します。
- BabelによるES6のプリコンパイル
- Webpackによるモジュールの依存解決
- css編集中

### product
`gulp prod`で下記のタスクを実行します。
- BabelによるES6のプリコンパイル
- Webpackによるモジュールの依存解決
- uglify
- concatは行いません（依存解決時にapp.jsで完結しています）
- css編集中

## インストール
appは任意のディレクトリ名です。

```
$ git clone git@github.com:taka-p/starter_kit_front_v1.git app
$ cd app
$ npm install
```

