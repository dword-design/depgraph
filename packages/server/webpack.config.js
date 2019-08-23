import CopyWebpackPlugin from 'copy-webpack-plugin'
import webpack from 'webpack'
import path from 'path'

export default {
  entry: {
    cli: './src/cli.js',
    'depcruise-sandbox': './src/depcruise-sandbox.js',
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: '#!/usr/bin/env node',
      raw: true,
      test: ['cli.js'],
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../client/dist'),
        to: 'client',
      },
    ]),
  ],
}
