const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
module.exports = {
  configureWebpack: {
    devtool: 'source-map', // Убедитесь, что добавлена карта кода для отладки
  },
  productionSourceMap: true, // Включите source map для production
};
