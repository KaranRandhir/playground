const setLocalStorage = (key,value) => {
    window.localStorage.setItem()
}

const getLocalStorage = (key) => {
    return window.localStorage.getItem(key)
}

const overrideConsoleLog = () => {
    const add = log => {
        const messageData = {src:"playground_iframe",payload:log}
        window.parent.postMessage(messageData,"*")
      }
      const originalError = window.console.error;
      const originalLog = window.console.log;
      const originalWarning = window.console.warn;
      const originalInfo = window.console.info;
      const originalClear = window.console.clear; 
      
      console.error = function (error) {
        if(typeof error?.stack !== "undefined"){
          add({msg:error.toString() + " " + error.stack ,type:"error"});
        }else{
          add({msg:error.toString(),type:"error"});
        }
        originalError.apply(console, arguments);
      };
      console.log = function (...args) {
        const logString = args.reduce((acc,item)=>{
          return acc + " " + item
        },"")
        add({msg:logString,type:"log"})
        
        originalLog.apply(console, args);
      };
      console.warn = function (...args) {
        args.forEach(arg=>add({msg:arg,type:"warn"}));
        originalWarning.apply(console, args);
      };
      console.info = function (...args) {
        args.forEach(arg=>add({msg:arg,type:"info"}));
        originalInfo.apply(console, args);
      };
      console.clear = function (...args) {
        window.parent.postMessage(JSON.stringify({type:"clear_logs"}),"*")
        originalClear.apply(console, args);
      };
      
}

const customConsolePlugin =  {
  visitor: {
      CallExpression(path, state) {

          const opts = state;
   

          if (path.node.callee.object &&
              path.node.callee.object.name === 'console' &&
              path.node.callee.property.name !== 'table') {

              let file = state.file.opts.filename;

              if(typeof opts.resolveFile === 'function') {
                  file = opts.resolveFile(file);
              } else if (!opts || opts.segments !== 0) {
                  file = state.file.opts.filename.split(((opts.splitSegment) ? opts.splitSegment : '/'));
                  let segs = file.slice(Math.max(file.length - opts.segments));
                  file = segs.join('/');
              }

              let value = `${file} (${path.node.loc.start.line}:${path.node.loc.start.column})`

              if(path.node.arguments[0].value !== value) {
                  path.node.arguments.unshift({
                      type: 'StringLiteral',
                      value
                  });
              }

          }

      }
  }
};

//plugin not working with console error 

export {setLocalStorage,getLocalStorage,overrideConsoleLog,customConsolePlugin}
