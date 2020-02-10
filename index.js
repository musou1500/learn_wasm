const fs = require("fs");

const instantiateAsm = filename => new Promise((resolve, reject) =>
  fs.readFile("./add.wasm", (err, data) =>
    err ? reject(err) : resolve(WebAssembly.instantiate(data))
  )
);

const fns = {
  add: async () => {
    const result = await instantiateAsm("./add.wasm");
    console.log(result.instance.exports.add(2, 3));
  },
  globalVar: async () => {
    const global = new WebAssembly.Global({value: "i32", mutable: true}, 0);
    const importObj = {
      console: {
        log: arg => console.log(arg)
      },
      js: { global }
    };
    const result = await instantiateAsm("./global_var.wasm");
    result.instance.exports.incGlobal();
    result.instance.exports.incGlobal();
    result.instance.exports.incGlobal();
    console.log(result.instance.exports.getGlobal());
  }
};

fns[process.argv[2]]();
