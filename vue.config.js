const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  base: '/shop/',
  transpileDependencies: true,
})
module.exports = {
  configureWebpack: {
    devtool: 'source-map', // Убедитесь, что добавлена карта кода для отладки
  },
  productionSourceMap: true, // Включите source map для production
};
