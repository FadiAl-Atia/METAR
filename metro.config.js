const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);
const root = __dirname.replace(/[/\\]/g, '[/\\\\]');

config.watchFolders = [__dirname];
config.resolver.blockList = [
  new RegExp(`^${root}[/\\\\]android[/\\\\].*`),
  new RegExp(`^${root}[/\\\\]ios[/\\\\].*`),
  /\/\.git\/.*/,
];

module.exports = withNativeWind(config, { input: './global.css' });
