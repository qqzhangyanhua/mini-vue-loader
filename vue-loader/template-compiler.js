const compiler = require("vue/compiler-sfc");
function templateCompiler(source) {
  const loaderContext = this;
  const query = new URLSearchParams(loaderContext.resourceQuery.slice(1));
  const { code } = compiler.compileTemplate({
    source,
    id: query.get("id"),
  });
  loaderContext.callback(null, code);
}
module.exports = templateCompiler;
