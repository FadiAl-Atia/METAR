const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);
config.watchFolders = [__dirname];
config.resolver.blockList = [
  /node_modules\/.*\/node_modules\/.*/,
    /android\/.*/,
      /ios\/.*/,
        /\.git\/.*/,
        ];
        module.exports = config;