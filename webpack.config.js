import CopyWebpackPlugin from 'copy-webpack-plugin'
import path from 'path'

export default {
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.resolve(path.dirname(require.resolve('@dword-design/base-depgraph-client-spring/package.json')), 'dist'),
        to: 'client',
      },
    ]),
  ],
}
