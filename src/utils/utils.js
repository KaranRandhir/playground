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
        
        args.forEach(arg=>{
          add({msg:arg,type:"log"})
         });
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
export {setLocalStorage,getLocalStorage,overrideConsoleLog}
