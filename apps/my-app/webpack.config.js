const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  return await createExpoWebpackConfigAsync(
      {
        ...env,
        babel: {
          dangerouslyAddModulePathsToTranspile: [
            // Add additional problem packages to the transpiler
            '@aws-amplify/ui-react-native',
          ],
        },
      },
      argv
  );
};