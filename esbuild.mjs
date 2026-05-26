import * as esbuild from 'esbuild';
import autoprefixer from 'autoprefixer';
import postcss from 'postcss';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';

const sharedLoaders = {
  '.svg': 'dataurl',
  '.woff': 'file',
  '.woff2': 'file',
  '.ttf': 'file',
  '.eot': 'file'
};

async function ensureDir(dir) {
  await mkdir(dir, { recursive: true });
}

async function postprocessCssFile(cssPath) {
  const css = await readFile(cssPath, 'utf8');
  const mapPath = `${cssPath}.map`;
  let prevMap;

  if (!isProduction) {
    try {
      prevMap = await readFile(mapPath, 'utf8');
    } catch {}
  }

  const result = await postcss([autoprefixer]).process(css, {
    from: cssPath,
    to: cssPath,
    map: isProduction ? false : { inline: false, annotation: true, prev: prevMap || undefined }
  });

  await writeFile(cssPath, result.css);
  if (result.map) {
    await writeFile(mapPath, result.map.toString());
  }
}

function postcssPlugin() {
  return {
    name: 'postcss',
    setup(build) {
      build.onEnd(async (result) => {
        if (result.errors.length > 0) {
          return;
        }

        const outfile = build.initialOptions.outfile;
        if (!outfile || !outfile.endsWith('.css')) {
          return;
        }

        await postprocessCssFile(outfile);
      });
    }
  };
}

function createCssBuild(entryFile, outputFile) {
  return {
    entryPoints: [resolve(__dirname, entryFile)],
    bundle: true,
    outfile: resolve(__dirname, outputFile),
    loader: sharedLoaders,
    plugins: [postcssPlugin()],
    minify: isProduction,
    sourcemap: !isProduction,
    logLevel: 'info'
  };
}

function createJsBuild() {
  return {
    entryPoints: [resolve(__dirname, 'assets/tide.js')],
    bundle: true,
    outfile: resolve(__dirname, 'assets/build/js/tide-bundle.js'),
    platform: 'browser',
    target: 'es2018',
    loader: sharedLoaders,
    define: { 'process.env.NODE_ENV': isProduction ? '"production"' : '"development"' },
    minify: isProduction,
    sourcemap: !isProduction,
    logLevel: 'info',
    treeShaking: true,
    legalComments: 'none',
    drop: isProduction ? ['console', 'debugger'] : []
  };
}

function getBuildConfigs() {
  return [
    createCssBuild('assets/css/vendor.css', 'assets/build/css/vendor.css'),
    createCssBuild('assets/css/vendor.rtl.css', 'assets/build/css/vendor.rtl.css'),
    createCssBuild('assets/css/tide.css', 'assets/build/css/tide.css'),
    createJsBuild()
  ];
}

async function build() {
  console.log(`Building tide theme (${isProduction ? 'production' : 'development'}) with esbuild ...`);
  const startTime = Date.now();

  try {
    await ensureDir(resolve(__dirname, 'assets/build/css'));
    await ensureDir(resolve(__dirname, 'assets/build/js'));

    for (const config of getBuildConfigs()) {
      await esbuild.build(config);
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✓ Build complete in ${duration}s\n`);

  } catch (error) {
    console.error('✗ Build failed:', error);
    process.exit(1);
  }
}

const args = process.argv.slice(2);
if (args.includes('--watch')) {
  Promise.all([
    ensureDir(resolve(__dirname, 'assets/build/css')),
    ensureDir(resolve(__dirname, 'assets/build/js'))
  ]).then(async () => {
    const contexts = await Promise.all(getBuildConfigs().map((config) => esbuild.context(config)));
    await Promise.all(contexts.map((context) => context.watch()));
    console.log('✓ Watching for changes ...\n');
  }).catch(error => {
    console.error('✗ Watch failed:', error);
    process.exit(1);
  });
} else {
  build();
}
