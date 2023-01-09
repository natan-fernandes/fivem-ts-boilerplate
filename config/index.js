const path = require('path');

const root = path.resolve(__dirname, '..');
const resourcesPath = path.resolve(root, 'resources');
const currentResourcePath = resource => path.resolve(resourcesPath, resource, 'src');

//* Edit here
const serverFolder = path.resolve(root, 'dist');
const serverResourcesPath = resource => path.resolve(serverFolder, 'resources', '[local]', resource);
//*---

module.exports = {
  currentResourcePath,
  serverResourcesPath
}
