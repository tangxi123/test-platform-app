const {
    addLessLoader,
    fixBabelImports,
    override
  } = require("customize-cra");
  
  module.exports = {
    webpack: override(
      addLessLoader({
        modifyVars: {
                "@layout-body-background": "#FFFFFF",
                "@layout-header-background": "#FFFFFF",
                "@layout-footer-background": "#FFFFFF"
           },
        javascriptEnabled: true
      }),
      fixBabelImports("babel-plugin-import", {
        libraryName: "antd",
        style: true
      })
    )
  };
  