const fs = require("fs");

const instantiateAsm = (filename, ...rest) =>
  new Promise((resolve, reject) =>
    fs.readFile(filename, (err, data) =>
      err ? reject(err) : resolve(WebAssembly.instantiate(data, ...rest))
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
    const result = await instantiateAsm("./global_var.wasm", importObj);
    result.instance.exports.incGlobal();
    result.instance.exports.incGlobal();
    result.instance.exports.incGlobal();
    console.log(result.instance.exports.getGlobal());
  },
  mem: async () => {
    const mem = new WebAssembly.Memory({initial: 1});
    const importObj = {
      js: { mem },
      console: { log: consoleLogString }
    };
    function consoleLogString(offset, length) {
      var bytes = new Uint8Array(mem.buffer, offset, length);
      var string = new TextDecoder('utf8').decode(bytes);
      console.log(string);
    }

    const result = await instantiateAsm("./mem.wasm", importObj);
    result.instance.exports.writeHi();
  },
  tbl: async () => {
    const result = await instantiateAsm("./tbl.wasm");
    console.log(result.instance.exports.callByIndex(0));
    console.log(result.instance.exports.callByIndex(1));
  }
};

fns[process.argv[2]]();
