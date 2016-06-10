import webpack from 'webpack';

// ディレクトリ,ファイル名,その他設定
export const conf = {
    jsFileName : 'app.js',                   // 基点ファイル名(小規模であれば処理もまとめる)
    jsDestDir  : './develop/build/js',       // 出力先ディレクトリ
    jsSrcDir   : './develop/src/js',         // リソース格納ディレクトリ
    jsSrcFormat: '/**/*.js',                 // リソースのフォーマット
    jsSrc      : './develop/src/js/**/*.js',
    jsUglify   : false,                      // テストでuglifyする場合はtrue

    cssFileName : 'app.scss',
    cssDestDir  : './develop/build/css/',
    cssSrcDir   : './develop/src/scss/',
    cssSrcFormat: '*.scss',
    cssSrc      : './develop/src/scss/**/*.scss',
    cssNano     : false, // テストでcssnanoする場合はtrue
    browsers: [
        // doiuse設定 - https://github.com/ai/browserslist#queries
        // 国内端末シェア - http://smatabinfo.jp/index.html
        'last 2 version',
        'ios >= 5',
        'android >= 4'
    ],
    ignores: [
        // doiuse設定から弾く
        'background-img-opts'
    ]
};

// webpackの設定
export const setting = {
    webpack: {
        entry: conf.jsSrcDir + '/' + conf.jsFileName,
        output: {
            filename: conf.jsFileName
        },
        resolve: {
            extensions: ['', '.js'],
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
