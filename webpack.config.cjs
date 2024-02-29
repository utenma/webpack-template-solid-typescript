// @ts-check
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const StylexWebpackPlugin = require('@stylexjs/webpack-plugin')
const stylexBabelPlugin = require('@stylexjs/babel-plugin')

/** @returns { import('webpack').Configuration } */
module.exports = (env, argv) => {
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