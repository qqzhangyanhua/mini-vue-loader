const { stringifyRequest } = require("./utils");
const stylePostLoader = require.resolve('./style-post-loader');
const isCSSloader = loader=>/css-loader/.test(loader.path)
const pitcher = code=>code;
const isNotPitcher =loader=>loader.path!==__filename
const pitch=function(){
const loaderContext = this;
//loaders是一个数组，里面存放的是所有的loader['pitcher','vue-loader]过滤掉自己
const loaders = loaderContext.loaders.filter(isNotPitcher);
//查询字符串
const query = new URLSearchParams(loaderContext.resourceQuery.slice(1));
if(query.get('type')==='style'){
    const cssLoaderIndex = loaders.findIndex(isCSSloader)
    return  genProxyModule(
       [...loaders.slice(0,cssLoaderIndex+1),{request:stylePostLoader},...loaders.slice(cssLoaderIndex+1)],
        loaderContext,
    )
}
return genProxyModule(loaders,loaderContext ,query.get('type')!=='template');
}

function genProxyModule(loaders, loaderContext,exportDefault=true){
    const request = getRequest(loaders, loaderContext);
    //script style都是默认导出 template是全部导出
    return exportDefault? `export {default} from ${request}`:`export * from ${request}`;
}
function getRequest(loaders,loaderContext){
    //loader文件的绝对路径
    const loaderStrings = loaders.map(loader=>loader.request||loader);
    //要加载资源文件的绝对路径
    const resource =loaderContext.resourcePath + loaderContext.resourceQuery;
    //为了忽视掉 具体参考文档-!  !!
    return stringifyRequest(loaderContext,
        '-!'+[...loaderStrings,resource].join('!')
        )
}
pitcher.pitch = pitch;
module.exports = pitcher;