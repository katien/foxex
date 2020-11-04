const CopyPlugin = require('copy-webpack-plugin');

/**
 * These configurations point vue-cli-service at the ./client directory
 * */
module.exports = {
  outputDir: './client/dist',
  chainWebpack: config => {
    config
      .plugin('fork-ts-checker')
      .tap(args => {
        args[0].tsconfig = './client/tsconfig.json';
        return args;
      });

    config.plugin("html")
      .tap(args => {
        args[0].template = "./client/public/index.html";
        return args;
      })
  },
  configureWebpack: {
    entry: {
      app: './client/src/main.ts'
    },

    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: './client/public', to: './',
            globOptions: {
              ignore: ['index.html'],
            },
          },
        ]
      }),
    ],
  }
};