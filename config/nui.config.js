const resourceName = process.argv.slice(2)[0];
if (!resourceName) throw new Error('❌ Resource name should be provided. Usage: yarn build <resourceName>');

const execSync = require('child_process').execSync;
const output = execSync(`cd ./resources/${resourceName}/src/web && yarn build`, { encoding: 'utf-8' });
console.log(output);
