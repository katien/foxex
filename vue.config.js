module.exports = {
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