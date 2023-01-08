<h1 align="center">FiveM TypeScript Boilerplate</h1>

This repository is a basic boilerplate for getting started
with TypeScript in FiveM scripting. It contains helpful utilities such as:
* delay
* emitNetPromise (client)
* onNetPromise (server)
* prisma (server)


## Requirements
* [Node > v10.6](https://nodejs.org/en/)
* [Yarn](https://yarnpkg.com/getting-started/install) (Preferred but not required)


## Getting Started
First clone the repository somewhere near your server folder, 
then point `serverFolder` at `esbuild.config.js` to your server folder.
You can also change `[local]` at `serverResourcesPath` to any desired name, that's 
the output folder of your resources  
run `yarn` to install the dependencies and `yarn build <resourceName>` to build your resource


### Installation
*The boilerplate was made using `yarn` but is still compatible with
`npm`.*

