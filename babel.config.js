module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
  // Warning: remove 'expo-router/babel' here; it is no longer required in SDK 50
      
      // Support @ alias like import x from "@/foo/bar"
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './',
          },
          extensions: ['.tsx', '.ts', '.js', '.json']
        }
      ],
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env",
          path: ".env",
          allowUndefined: true
        }
      ]
    ]
  };
};
