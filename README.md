<h1 align="center">FiveM TypeScript Boilerplate</h1>

This repository is a basic boilerplate for getting started
with TypeScript in FiveM scripting. It contains helpful utilities such as:
* delay
* emitNetPromise (client)
* onNetPromise (server)
* prisma (server)
* NUI with React + Vite


## Requirements
* [Node > v10.6](https://nodejs.org/en/)
* [Yarn](https://yarnpkg.com/getting-started/install) (Preferred but not required)


## Getting Started
First clone the repository somewhere near your server folder, 
then point `serverFolder` at `esbuild.config.js` to your server folder.
You can also change `[local]` at `serverResourcesPath` to any desired name, that's 
the output folder of your resources.  
Run `yarn` to install the dependencies and `yarn build <resourceName>` to build your resource.  

You can build the NUI separately by going running `yarn build-nui <resourceName>`  

### Installation
*The boilerplate was made using `yarn` but is still compatible with
`npm`.*

---

Credits to project-error for the react boilerplate. It is available at: 
https://github.com/project-error/fivem-react-boilerplate-lua
