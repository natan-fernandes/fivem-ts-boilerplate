<h1 align="center">FiveM TypeScript Boilerplate</h1>

This repository is a basic boilerplate for getting started
with TypeScript in FiveM scripting. It contains helpful utilities such as:
* delay
* emitNetPromise (client)
* onNetPromise (server)
* prisma (server)
* NUI with React + Vite (credits to [project-error](https://github.com/project-error/fivem-react-boilerplate-lua))


## Requirements
* [Node > v10.6](https://nodejs.org/en/)
* [Yarn](https://yarnpkg.com/getting-started/install) (Preferred but not required)


## Getting Started
First clone the repository somewhere near your server folder, 
then point `serverFolder` in `esbuild.config.js` to your server folder.
You can also change `[local]` in `serverResourcesPath` to any desired name, that's 
the output folder of your resources.  
Run `yarn` in the root folder to install the dependencies and `yarn build <resourceName>` to build your resource.  

You can build the NUI separately by going running `yarn build-nui <resourceName>` in the root folder  

**NOTE:**
> `build-nui` will only build the web project and NOT copy the bundle to your server's resource folder. Running `yarn build <resource>` on the root folder will copy everything to your server's resource folder including the NUI bundle IF it's was built beforewards.  

`yarn build <resourceName> <true>` will enable watch mode.

### Installation
*The boilerplate was made using `yarn` but is still compatible with
`npm`.*

---

Credits to project-error for the react boilerplate. It is available at: 
https://github.com/project-error/fivem-react-boilerplate-lua
