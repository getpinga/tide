import * as esbuild from 'esbuild';
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';

async function build() {
  console.log(`Building tide theme (${isProduction ? 'production' : 'development'}) with esbuild ...`);
  const startTime = Date.now();

  try {
    const jsDir = resolve(__dirname, 'assets/build/js');

    await esbuild.build({
      entryPoints: [resolve(__dirname, 'assets/tide.js')],
      bundle: true,
      outfile: join(jsDir, 'tide-bundle.js'),
      platform: 'browser',
      target: 'es2018',
      define: { 'process.env.NODE_ENV': isProduction ? '"production"' : '"development"' },
      minify: isProduction,
      sourcemap: !isProduction,
      logLevel: 'info',
      treeShaking: true,
      legalComments: 'none',
      drop: isProduction ? ['console', 'debugger'] : []
    });

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✓ Build complete in ${duration}s\n`);

  } catch (error) {
    console.error('✗ Build failed:', error);
    process.exit(1);
  }
}

const args = process.argv.slice(2);
if (args.includes('--watch')) {
  // Simple watch script for esbuild
  esbuild.context({
    entryPoints: [resolve(__dirname, 'assets/tide.js')],
    bundle: true,
    outfile: join(resolve(__dirname, 'assets/build/js'), 'tide-bundle.js'),
    platform: 'browser',
    target: 'es2018',
    define: { 'process.env.NODE_ENV': isProduction ? '"production"' : '"development"' },
    minify: isProduction,
    sourcemap: !isProduction,
    logLevel: 'info'
  }).then(ctx => {
    ctx.watch();
    console.log('✓ Watching for changes ...\n');
  }).catch(error => {
    console.error('✗ Watch failed:', error);
    process.exit(1);
  });
} else {
  build();
}