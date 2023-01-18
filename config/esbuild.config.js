const resourceName = process.argv.slice(2)[0];
if (!resourceName) throw new Error('❌ Resource name should be provided. Usage: yarn build <resourceName>');

const path = require('path');
const esbuild = require('esbuild');
const { filelocPlugin } = require("esbuild-plugin-fileloc");
const { copy } = require('esbuild-plugin-copy');

const { currentResourcePath, serverResourcesPath } = require('.');

const entry = currentResourcePath(resourceName);
const output = serverResourcesPath(resourceName);

const watch = process.argv.slice(3)[0];
const watchConfig = (side) => watch && {
  onRebuild(err, result) {
    if (err) console.error(err)
    else console.log(`👀 [${side}]: Built successfully!`)
  }
};

esbuild.build({
  entryPoints: [`${entry}/client/client.ts`],
  outdir: output,
  bundle: true,
  minify: false,
  format: 'esm',
  target: ['ES2017'],
  watch: watchConfig('client'),
  plugins: [
    copy({
      resolveFrom: 'cwd',
      assets: [
        {
          from: [`./resources/${resourceName}/*.lua`],
          to: [output],
          keepScructure: true
        },
        {
          from: [`./resources/${resourceName}/src/stream/**/*`],
          to: [path.resolve(output, 'stream')],
          keepScructure: true
        },
        {
          from: [`./resources/${resourceName}/src/web/dist/**/*`],
          to: [path.resolve(output, 'nui')],
          keepScructure: true
        }
      ]
    })
  ]
})
.then(() => console.log('🚀 [client]: Built successfully!'))
.catch((err) => console.log(err));

esbuild.build({
  entryPoints: [`${entry}/server/server.ts`],
  outdir: output,
  bundle: true,
  minify: false,
  format: 'cjs',
  keepNames: true,
  target: ['node16'],
  platform: 'node',
  watch: watchConfig('server'),
  plugins: [filelocPlugin()] //? Necessary to prisma be able to get __dirname
})
.then(() => console.log('🚀 [server]: Built successfully!'))
.catch((err) => console.log(err));
