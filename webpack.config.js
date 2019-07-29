import CopyWebpackPlugin from 'copy-webpack-plugin'
import webpack from 'webpack'
import path from 'path'

export default {
  entry: {
    cli: './src/cli.js',
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: '#!/usr/bin/env node',
      test: 'cli.js',
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(path.dirname(require.resolve('@dword-design/base-depgraph-client-spring/package.json')), 'dist'),
        to: 'client',
      },
    ]),
  ],
}
