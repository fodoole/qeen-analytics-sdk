const { Compilation } = require('webpack');

class IIFEWrapperPlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('IIFEWrapperPlugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'IIFEWrapperPlugin',
          stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE,
        },
        (assets) => {
          Object.keys(assets).forEach((assetName) => {
            if (assetName.endsWith('.js')) {
              const asset = assets[assetName];
              const originalSource = asset.source();
              const wrappedSource = `(()=>{${originalSource}})();`;

              compilation.updateAsset(
                assetName,
                new compiler.webpack.sources.RawSource(wrappedSource)
              );
            }
          });
        }
      );
    });
  }
}

module.exports = IIFEWrapperPlugin;