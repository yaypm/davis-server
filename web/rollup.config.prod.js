import rollup      from 'rollup';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs    from 'rollup-plugin-commonjs';
import uglify      from 'rollup-plugin-uglify';

export default {
  entry: 'src/main.prod.js',
  dest: 'dist/build.min.js',
  sourceMap: true,
  sourceMapFile: 'dist/build.min.js.map',
  format: 'iife',
  plugins: [
    nodeResolve({ jsnext: true, module: true }),
    commonjs({
      include: [ 'node_modules/rxjs/**' ],
    }),
    uglify()
  ]
}