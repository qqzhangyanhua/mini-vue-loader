const compiler = require("vue/compiler-sfc");
const { stringifyRequest } = require("./utils");
const VueLoaderPlugin = require("./plugin");
const select = require("./select");
const hash = require("hash-sum");
function loader(source) {
  console.log("开始执行==========");
  //loaderContext 执行时候的this 指针
  const loaderContext = this;
  //resourcePath 资源文件的绝对路径
  //resourceQuery 资源文件的查询字符串
  const { resourcePath, resourceQuery } = loaderContext;
  const rawQuery = resourceQuery.slice(1);
  const incomingQuery = new URLSearchParams(rawQuery);
  const { descriptor } = compiler.parse(source);
  const id = hash(resourcePath);
  if (incomingQuery.get("type")) {
    return select.selectBlock(descriptor, id, loaderContext, incomingQuery);
  }
  const code = [];
  const { script, template, styles } = descriptor;
  const hasScoped =styles.some(s=>s.scoped);
  if (script) {
    const query = `?vue&type=script&lang=js`;
    const request = stringifyRequest(loaderContext, resourcePath + query);
    code.push(`import script from ${request}`);
  }
  if (template) {
    const scopedQuery = hasScoped ? `&scoped=true` : ``;
    const query = `?vue&type=template&id=${id}${scopedQuery}&lang=js`;
    const request = stringifyRequest(loaderContext, resourcePath + query);
    code.push(`import {render} from ${request}`);
  }
  if (styles.length > 0) {
    styles.forEach((style, index) => {
    const scopedQuery = hasScoped ? `&scoped=true` : ``;
      const query = `?vue&type=style&index=${index}&id=${id}${scopedQuery}&lang=css`;
      const request = stringifyRequest(loaderContext, resourcePath + query);
      code.push(`import ${request}`);
    });
  }
  if(hasScoped){
    code.push(`script.__scopeId = "data-v-${id}" `)
  }
  code.push(`script.render = render`);
  code.push(`export default script`);
  return code.join("\n");
}
loader.VueLoaderPlugin = VueLoaderPlugin;
module.exports = loader;
