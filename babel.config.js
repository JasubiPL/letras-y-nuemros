module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['.'],
          alias: {
            '@shared': './src/shared',
            '@features': './src/features',
            '@hooks': './src/hooks',
            '@stores': './src/stores',
            '@services': './src/services',
            '@constants': './src/constants',
            '@appTypes': './src/types',
            '@utils': './src/utils',
            '@assets': './assets',
          },
        },
      ],
      'react-native-reanimated/plugin', // SIEMPRE al final
    ],
  };
};