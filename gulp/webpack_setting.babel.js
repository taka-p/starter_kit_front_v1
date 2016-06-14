/* webpack setting */

import webpack from 'webpack';
import conf from './config.babel';

export default {
  webpack: {
    entry: conf.jsSrcDir + '/' + conf.jsFileName,
    output: {
      filename: conf.jsFileName
    },
    resolve: {
      extensions: ['', '.min.js', '.js'],
      modulesDirectories: ['node_modules', 'bower_components'],
      alias: {}
    },
    plugins: [
      new webpack.ResolverPlugin(
        new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])
      ),
      // ライブラリ間で依存しているモジュールが重複している場合、二重に読み込まないようにする
      new webpack.optimize.DedupePlugin(),
      //ファイルを細かく分析し、まとめられるところはできるだけまとめてコードを圧縮する
      new webpack.optimize.AggressiveMergingPlugin(),
      new webpack.ProvidePlugin({
        jQuery: 'jquery',
        $: 'jquery',
        jquery: 'jquery'
      })
    ],
    module: {
      // babel Loaderを指定してWebpackがBabelのコンパイルをできるように
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        }
      ]
    }
  }
};
