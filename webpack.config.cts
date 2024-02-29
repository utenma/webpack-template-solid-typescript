import path from 'path'

import type webpack from 'webpack'
import 'webpack-dev-server'

import CopyPlugin from 'copy-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from "mini-css-extract-plugin"

import stylexBabelPlugin from '@stylexjs/babel-plugin'
import StylexWebpackPlugin from '@stylexjs/webpack-plugin'

const config = (env: Record<string, string>, argv: Record<string, string>): webpack.Configuration => {
    const dev = argv.mode === 'development'
    const prod = !dev
    const stylex_options: Partial<ConstructorParameters<typeof StylexWebpackPlugin>[0]> = {
        useCSSLayers: true,
        // Required for CSS variable support
        unstable_moduleResolution: {
            type: 'commonJS',
            // The absolute path to the root directory of your project
            rootDir: __dirname,
        }
    }

    return {
        target: 'web',
        entry: './src/index.tsx',
        output: {
            filename: '[name].bundle.js',
            path: path.resolve(__dirname, 'dist'),
            clean: true
        },
        mode: dev ? 'development' : 'production',
        devtool: 'inline-source-map',
        devServer: {
            port: 8080,
            hot: true,
            liveReload: false,
            static: './dist',
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: "[name].bundle.css",
                chunkFilename: "[id].css",
            }),
            // Ensure that the stylex plugin is used before Babel
            prod && new StylexWebpackPlugin({
                // filename: 'stylex.css',
                // get webpack mode and set value for dev
                dev: false,
                appendTo: "main.bundle.css",
                // appendTo: 'head',
                // Use statically generated CSS files and not runtime injected CSS.
                // Even in development.
                runtimeInjection: false,
                classNamePrefix: 'x',
                ...stylex_options
            }),
            new HtmlWebpackPlugin({
                template: "src/index.html",
            }),
            new CopyPlugin({
                patterns: [
                    {
                        from: "public",
                        to: "./"
                    }
                ],
            }),
            new ForkTsCheckerWebpackPlugin(),
        ].filter(Boolean),
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        module: {
            rules: [
                {

                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                env: {
                                    development: {
                                        plugins: [
                                            "solid-refresh/babel",
                                            dev && [
                                                stylexBabelPlugin,
                                                {
                                                    dev: true,
                                                    useCSSLayers: true,
                                                    ...stylex_options
                                                }
                                            ]
                                        ].filter(Boolean)
                                    }
                                },
                                presets: [
                                    ["solid"]
                                ]
                            },
                        },
                        {
                            loader: 'ts-loader',
                            options: {
                                transpileOnly: true,
                            },
                        },
                    ]
                },
                {
                    test: /\.s?css$/i,
                    use: [MiniCssExtractPlugin.loader, 'css-loader'],
                },
                {
                    test: /\.(png|jpg|jpeg|gif)$/i,
                    type: 'asset/resource',
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/i,
                    type: 'asset/resource',
                }
            ],
        }
    }
}

export default config
