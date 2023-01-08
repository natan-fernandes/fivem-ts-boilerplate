const path = require('path');
const esbuild = require('esbuild');
const { filelocPlugin } = require("esbuild-plugin-fileloc");
const { copy } = require('esbuild-plugin-copy');

const root = path.resolve(__dirname);
const resourcesPath = path.resolve(__dirname, 'resources');
const currentResourcePath = resource => path.resolve(resourcesPath, resource, 'src');

//* Edit here
const serverFolder = path.resolve(root, 'dist');
const serverResourcesPath = resource => path.resolve(serverFolder, 'resources', '[local]', resource);
//*---

const resourceName = process.argv.slice(2)[0];
if (!resourceName) throw new Error('❌ Resource name should be provided. Usage: yarn build <resourceName>');

const entry = currentResourcePath(resourceName);
const output = serverResourcesPath(resourceName);

esbuild.build({
  entryPoints: [`${entry}/client/client.ts`],
  outdir: output,
  bundle: true,
  minify: false,
  format: 'esm',
  target: ['ES2017'],
  plugins: [
    copy({
      resolveFrom: 'cwd',
      assets: [{
        from: [`./resources/${resourceName}/*.lua`],
        to: [output],
        keepScructure: true
      },
      {
        from: [`${entry}/stream/**/*`],
        to: [path.resolve(output, 'stream')],
        keepScructure: true
      }]
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
  plugins: [filelocPlugin()] //? Necessary to prisma be able to get __dirname
})
.then(() => console.log('🚀 [server]: Built successfully!'))
.catch((err) => console.log(err));
