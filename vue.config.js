/**
 * These configurations point vue-cli-service at the ./client directory
 * */
module.exports = {
  outputDir:'./client/dist',
  chainWebpack: config => {
    config
      .plugin('fork-ts-checker')
      .tap(args => {
        args[0].tsconfig = './client/tsconfig.json';
        return args;
      });
  },
  configureWebpack: {
    entry: {
      app: './client/src/main.ts'
    }
  }
};