const ruleResource = (query, resource) => `${resource}.${query.get("lang")}`;
class VueLoaderPlugin {
  apply(compiler) {
    const rules = compiler.options.module.rules;
    //在所有模块解析规则之前加一个pitcher
    const pitcher = {
      loader: require.resolve("./pitcher"),
      resourceQuery: (query) => {
        if (!query) return false;
        let parse = new URLSearchParams(query.slice(1));
        return parse.get("vue") !== null;
      },
    };
    const templateCompiler = {
      loader: require.resolve("./template-compiler"),
      resourceQuery: (query) => {
        if (!query) return false;
        let parse = new URLSearchParams(query.slice(1));
        return parse.get("vue") !== null && parse.get("type") === "template";
      },
    };
    const vueRule = rules.find((rule) =>'foo.vue'.match(rule.test));
    const cloneRules = rules
      .filter((rule) => rule !== vueRule)
      .map((rule) => cloneRule(rule));
    compiler.options.module.rules = [
      pitcher,
      templateCompiler,
      ...cloneRules,
      ...rules,
    ];
  }
}
function cloneRule(rule) {
  let currentRule;
  const result = Object.assign(Object.assign({}, rule), {
    resource: (r) => {
      currentRule = r;
      return true;
    },
    resourceQuery: (query) => {
      if (!query) return false;
      let parse = new URLSearchParams(query.slice(1));
      if (parse.get("vue") === null) {
        return false;
      }
      const fakeResource = ruleResource(parse, currentRule);
      console.log('fakeResource===',fakeResource);
      if (!fakeResource.match(rule.test)) {
        return false;
      }
      return true;
    },
  });
  delete result.test;
  return result;
}
module.exports = VueLoaderPlugin;
