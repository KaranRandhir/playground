import React from "react"

const overwriteLogMethods = () => {
    const add = something => {
        // ... add a new element to the panel
      }
      const originalError = console.error;
      const originalLog = console.log;
      const originalWarning = console.warn;
      const originalInfo = console.info;
      const originalClear = console.clear;
      
      console.error = function (error) {
        add(error.toString() + error.stack);
        originalError.apply(console, arguments);
      };
      console.log = function (...args) {
        args.forEach(add);
        originalLog.apply(console, args);
      };
      console.warn = function (...args) {
        args.forEach(add);
        originalWarning.apply(console, args);
      };
      console.info = function (...args) {
        args.forEach(add);
        originalInfo.apply(console, args);
      };
      console.clear = function (...args) {
        element.innerHTML = '';
        originalClear.apply(console, args);
      };
      
}

const Console = ({addLog,logs}) => {
    return (
        <div>
            
        </div>
    )   
}


