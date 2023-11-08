const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Find the project and workspace directories
const projectRoot = __dirname;
// This can be replaced with `find-yarn-workspace-root`
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];
// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];
// 3. Force Metro to resolve (sub)dependencies only from the `nodeModulesPaths`
config.resolver.disableHierarchicalLookup = true;

//module.exports = config;
//Adding the below change due to the below error:
//Web Bundling failed 293ms
//Unable to resolve "@aws-amplify/ui-react-core" from "../../node_modules/@aws-amplify/ui-react-native/dist/Authenticator/index.js"
module.exports = {
    ...config,
    resolver: {
        ...config.resolver,
        blockList: [config.resolver.blockList, /\/amplify\/.*$/],
        sourceExts: [...config.resolver.sourceExts, "mjs"],
    },
};
