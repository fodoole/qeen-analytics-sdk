class IIFEWrapperPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('IIFEWrapperPlugin', (compilation, callback) => {
      Object.keys(compilation.assets).forEach((assetName) => {
        if (assetName.endsWith('.js')) {
          const asset = compilation.assets[assetName];
          const originalSource = asset.source();
          const wrappedSource = `(()=>{${originalSource}})();`;
          
          compilation.assets[assetName] = {
            source: () => wrappedSource,
            size: () => wrappedSource.length,
          };
        }
      });
      callback();
    });
  }
}

module.exports = IIFEWrapperPlugin;