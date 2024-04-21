import Editor from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";
import "./Playground.css";
import { transform } from "@babel/standalone";
import plugin from "babel-plugin-transform-remove-strict-mode"; // used for removing on strict which is added by babel by default
import lineNumberPlugin from "babel-plugin-console-source"
import "./script.js";
import jsIcon from "../../assets/icons/javascript-icon.png";
import cssIcon from "../../assets/icons/css-icon.png";
import htmlIcon from "../../assets/icons/html-icon.png";
import formatCodeIcon from "../../assets/icons/align-right.png";
import { DEFAULT_CSS, DEFAULT_HTML, DEFAULT_JS,RIGHT_PANEL_MODES } from "./constants.js";
import { customConsolePlugin, overrideConsoleLog } from "../../utils/utils.js";
function Playground() {
  const [js, updateJs] = useState(DEFAULT_JS);
  const [html, updateHtml] = useState(DEFAULT_HTML);
  const [css, updateCss] = useState(DEFAULT_CSS);
  const [document, changeDocument] = useState(``);
  const [updated, setUpdated] = useState(0);
  const editorRef = useRef({});
  const [editorMode, setEditorMode] = useState("javascript");
  const [logs, setLogs] = useState([]);
  const [rightPanelMode,setRightPanelMode] = useState(RIGHT_PANEL_MODES.OUTPUT)
  const iframeRef = useRef({})


  const getDocument = ({ html, css, js }) => {
    return `
    <html>
    <head>
    <style>
        ${css}
    </style>
   
      <meta charset="UTF-8" />
    </head>
    <body>
        ${html}
    </body>
    <script>
    
      window.parent.postMessage("HELLO_PARENT",'*');
      (${overrideConsoleLog.toString()})()
    try {
  ${js}
  }catch(err){
      console.error(err)
    }
   
    </script>
    </html>`;
  };
  const transpileCode = (js) => {
    const transpiledCode =  transform(js, {
      presets: ["env"],
      plugins: [plugin,customConsolePlugin],
      sourceMaps: "both",
      sourceType: "script",
      sourceFileName:"js",
      filename:"js"
    });

    // const sourceMap = transpiledCode.map

       return transpiledCode.code
  };

  const onHtmlEditorMount = (editor) => {
    editorRef.current.htmlEditor = editor;
  };

  const onJsEditorMount = (editor) => {
    editorRef.current.jsEditor = editor;
  };

  const onCssEditorMount = (editor) => {
    editorRef.current.cssEditor = editor;
  };

  const codeFormatParsers = {
    javascript: "babel",
    html: "html",
    css: "css",
  };

  const codeEditors = {
    javascript: "jsEditor",
    html: "htmlEditor",   
    css: "cssEditor",
  };

  const formatCode = async (code) => {
    let formattedCode = await window.prettier.format(code, {
      semi: false,
      parser: codeFormatParsers[editorMode],
      plugins: window.prettierPlugins,
    });
    editorRef.current[codeEditors[editorMode]].setValue(formattedCode);
  };

  useEffect(() => {
    window.addEventListener("message",(msg)=>{
      if(msg.data.src === "playground_iframe") {
        setLogs(prevlogs=>[...prevlogs,msg.data.payload])
      }
     
    })
    changeDocument(getDocument({ js: transpileCode(js), html, css })); // to render iframe
}, []);

  useEffect(()=>{
      setUpdated((prev) => prev + 1);
 },[document])
  return (
    <>
      <div className="options-header">
        <div className="language-options">
          <div class="sd-tabs">
            <input
              onClick={() => setEditorMode("html")}
              class="sd-tab-radio"
              name="tabs"
              type="radio"
              id="tabone"
              checked={editorMode === "html"}
            />
            <label class="sd-tab-label" for="tabone">
              <div class="sd-tab-desc">
                <img
                  src={htmlIcon}
                  height={"12px"}
                  width={"12px"}
                  style={{ marginRight: "4px" }}
                />
                HTML
              </div>
              {editorMode === "html" && (
                <div onClick={() => {
                  formatCode(html);
                }} title="format code" class="sd-tab-icon sd-tab-close">
                  <img height={"12px"} width={"12px"} src={formatCodeIcon} />
                </div>
              )}
            </label>

            <input
              onClick={() => setEditorMode("css")}
              class="sd-tab-radio"
              name="tabs"
              type="radio"
              id="tabtwo"
              checked={editorMode === "css"}
            />
            <label class="sd-tab-label" for="tabtwo">
              <div>
                <img
                  src={cssIcon}
                  height={"12px"}
                  width={"12px"}
                  style={{ marginRight: "4px" }}
                />
              </div>
              <div class="sd-tab-desc">CSS</div>
              {editorMode === "css" && (
                <div onClick={() => {
                  formatCode(css);
                }} title="format code" class="sd-tab-icon sd-tab-close">
                  <img height={"12px"} width={"12px"} src={formatCodeIcon} />
                </div>
              )}
            </label>

            <input
              onClick={() => setEditorMode("javascript")}
              class="sd-tab-radio"
              name="tabs"
              type="radio"
              id="tabthree"
              checked={editorMode === "javascript"}
            />
            <label class="sd-tab-label" for="tabthree">
              <div>
                <img
                  src={jsIcon}
                  height={"12px"}
                  width={"12px"}
                  style={{ marginRight: "4px" }}
                />
              </div>
              <div class="sd-tab-desc">JS</div>
              {editorMode === "javascript" && (
                <div
                  onClick={() => {
                    formatCode(js);
                  }}
                  title="format code"
                  class="sd-tab-icon sd-tab-close"
                >
                  <img height={"12px"} width={"12px"} src={formatCodeIcon} />
                </div>
              )}
            </label>
          </div>

          <div
            className="run-button"
            onClick={() => {
              changeDocument(getDocument({ js: transpileCode(js), html, css }));
              setUpdated((prev) => prev + 1);
            }}
          >
            Run
          </div>
        </div>

        <div className="output-options">
          <div
          className={`right-panel-button ${rightPanelMode===RIGHT_PANEL_MODES.OUTPUT && "selected"}`}
            onClick={() => {
              setRightPanelMode(RIGHT_PANEL_MODES.OUTPUT);
            }}
          >
            Output
          </div>
          <div  
          className={`right-panel-button ${rightPanelMode===RIGHT_PANEL_MODES.LOGS && "selected"}`}
          onClick={() => {
              setRightPanelMode(RIGHT_PANEL_MODES.LOGS);
            }}>Logs</div>
        </div>
      </div>
      <div className="editor-and-output-container">
        <div
          className={`code-editor ${editorMode !== "javascript" && "hidden"}`}
        >
          <Editor
            
            options={{ lineNumbersMinChars: 2 }}
            onChange={(value) => {
              updateJs(value);
              console.log(value);
            }}
            theme="vs-dark"
            defaultLanguage="javascript"
            defaultValue={DEFAULT_JS}
            onMount={onJsEditorMount}
          />
        </div>

        <div className={`code-editor ${editorMode !== "css" && "hidden"}`}>
          <Editor
            options={{ lineNumbersMinChars: 2 }}
            onChange={(value) => updateCss(value)}
            defaultValue={DEFAULT_CSS}
            theme="vs-dark"
            defaultLanguage="css"
            onMount={onCssEditorMount}
          />
        </div>

        <div className={`code-editor ${editorMode !== "html" && "hidden"}`}>
          <Editor
            options={{ lineNumbersMinChars: 2 }}
            onChange={(value) => updateHtml(value)}
            theme="vs-dark"
            defaultLanguage="html"
            defaultValue={DEFAULT_HTML}
            onMount={onHtmlEditorMount}
          />
        </div>
        {
          <iframe
          ref={iframeRef}
            className={`output ${rightPanelMode !== RIGHT_PANEL_MODES.OUTPUT && "hidden"}`}
            onError={(error) => console.log(error)}
            sandbox="allow-scripts"
            key={updated}
            srcDoc={document}
            height={"100%"}
          ></iframe>
        }
        {
          <div className={`logs ${rightPanelMode !== RIGHT_PANEL_MODES.LOGS && "hidden"}`}>
            <div className="clear-logs" onClick={()=>setLogs([])}>clear logs</div>
            {logs.map(item=><div className={item.type}>{item.msg}</div>)}

          </div>
        }
      </div>
    </>
  );
}

export default Playground;

// to be implemented
// -> forwardRef for Running the code through Headers x
// -> Saving code on cloud using json Blob x
// -> style fixes done
// -> iframe on error handling tbd
