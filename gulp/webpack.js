var webpack = require('webpack');
var path = require('path');
var console = require('chalk-log');
var q = require('q');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var dist_path = path.resolve(__dirname, '../app/dist');

var vendor_deps = Object.keys(require('../package.json').dependencies);
var workerEntrypoints = {
    //Example workers
    // map_geometry_worker: path.resolve(__dirname, '../app/scripts/modules/gl_map/services/map_geometry.worker.js'),
    // map_texture_worker: path.resolve(__dirname, '../app/scripts/modules/gl_map/services/map_texture.worker.js')
};

var appEntrypoint = path.resolve(__dirname, '../app/scripts/main.js');

var _doPack = function(conf, watch){

    var pack_def = q.defer();

    var reportStats = function (err, stats) {
        console.log(stats.toString({
            colors: true
        }));

        if (err) {
            pack_def.reject();
            return;
        }

        pack_def.resolve();
    };

    var compiler = webpack(conf);

    if(watch){
        compiler.watch({
            aggregateTimeout: 300,
            ignored: [/[\\/]node_modules[\\/]/]
        }, reportStats);
    }else{
        compiler.run(reportStats);
    }

    return pack_def.promise;

};

export function bundleVendor() {

    return _doPack({
        entry: {
            vendor: vendor_deps
        },

        output: {
            path: dist_path,
            filename: '[name].js',
            library: '[name]',
            publicPath: '/'
        },

        plugins: [
            new webpack.DllPlugin({
                name: '[name]',
                path: path.join( dist_path, '[name]-manifest.json' ),
            }),

            new webpack.SourceMapDevToolPlugin({
                filename: '[name].js.map'
            })
        ]
    }, false);

};

export function bundleApp(watch, analyze){
    var appConf, workerConf;

    appConf = {
        entry: {
            app: appEntrypoint
        },
        output: {
            path: dist_path,
            filename: '[name].js',
            publicPath: '/'
        },
        resolve: {
            extensions: ['.wasm', '.mjs', '.js', '.json', '.ts']
        },
        module: {
            rules: [
                {
                    test: /\.s[ca]ss$/,
                    use: [
                        {loader: "style-loader"},
                        {loader: "css-loader", options: {url: false}},
                        {loader: "sass-loader", options: {url: false}}
                    ]
                },

                //Fonts stuff
                {
                    test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?.*$|$)/,
                    loader: 'file-loader'
                },
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: ["source-map-loader"],
                    enforce: "pre"
                },

            ]
        },

        plugins: [
            new webpack.DllReferencePlugin({
                manifest: require(path.join(dist_path, 'vendor-manifest.json')),
            }),

            new webpack.SourceMapDevToolPlugin({
                filename: '[name].js.map'
            })
        ]
    };

    if(analyze)
        appConf.plugins.push(new BundleAnalyzerPlugin({
            analyzerMode: watch? 'server' : 'static'
        }));


    // workerConf = {};
    // Object.assign(workerConf, appConf);
    // workerConf.entry = workerEntrypoints;
    // workerConf.plugins = [
    //     new webpack.SourceMapDevToolPlugin({
    //         filename: '[name].js.map'
    //     })
    // ]

    // if(analyze)
    //     workerConf.plugins.push(new BundleAnalyzerPlugin({
    //         analyzerMode: watch? 'server' : 'static',
    //         analyzerPort: 8889
    //     }));

    return _doPack(appConf, watch);
};
