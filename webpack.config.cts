import path from 'path'

import type webpack from 'webpack'
import 'webpack-dev-server'

import CopyPlugin from 'copy-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'

import stylexBabelPlugin from '@stylexjs/babel-plugin'
import StylexWebpackPlugin from '@stylexjs/webpack-plugin'

const config = (env: Record<string, string>, argv: Record<string, string>): webpack.Configuration => {
    const dev = argv.mode === 'development'
    const prod = !dev
    const stylex_options = {
        dev,
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
            static: './dist',
        },
        plugins: [
            // Ensure that the stylex plugin is used before Babel
            prod && new StylexWebpackPlugin({
                filename: 'styles.[contenthash].css',
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
                                            [
                                                stylexBabelPlugin,
                                                {
                                                    test: false,
                                                    ...stylex_options
                                                }
                                            ]
                                        ]
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
                    use: ['style-loader', 'css-loader'],
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
