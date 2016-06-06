import webpack from 'webpack';

export const conf = {
    fileName : 'app.js',             // 基点ファイル名(小規模であれば処理もまとめる)
    destDir  : './develop/build/js', // 出力先ディレクトリ
    srcDir   : './develop/src/js',   // リソース格納ディレクトリ
    srcFormat: '/**/*.js'            // リソースのフォーマット
};

export const setting = {
    // リソース
    src: conf.srcDir + conf.srcFormat,
    // jsのビルド設定
    js: {
        dest: conf.destDir
        // uglify: false
    },
    // webpackの設定
    webpack: {
        entry: conf.srcDir + '/' + conf.fileName,
        output: {
            filename: conf.fileName
        },
        resolve: {
            extensions: ['', '.js'],
            modulesDirectories: ['node_modules', 'bower_components'],
            alias: {
            }
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
