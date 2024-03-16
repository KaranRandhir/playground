import Editor from "@monaco-editor/react";
import { useState } from "react";
import "./Playground.css";
import { transform } from "@babel/standalone";

function App() {
  const [js, updateJs] = useState(``);
  const [html, updateHtml] = useState(``);
  const [css, updateCss] = useState(``);
  const [document, changeDocument] = useState(``);

  const getDocument = ({ html, css, js }) => {
    return `
    <html>
    <head>
    <style>
        ${css}
    </style>
    <script>
        ${js}
    </script>
      <meta charset="UTF-8" />
    </head>
    <body>
        ${html}
    </body>
    </html>`;
  };

  const transformCode = (js) => {
    return transform(js, { presets: ["env"] }).code;
  };

  return (
    <>
      <div className="editor-container">
        <div className="code-editor">
          <Editor
            onChange={(value) => updateJs(value)}
            theme="vs-dark"
            defaultLanguage="javascript"
            defaultValue="// js"
          />
        </div>
        <div className="code-editor">
          <Editor
            className="code-editor"
            onChange={(value) => updateCss(value)}
            theme="vs-dark"
            defaultLanguage="css"
            defaultValue="// css"
          />
        </div>
        <div className="code-editor">
          <Editor
            className="code-editor"
            onChange={(value) => updateHtml(value)}
            theme="vs-dark"
            defaultLanguage="html"
            defaultValue="// html"
          />
        </div>
        <div className="code-editor">
          <iframe srcDoc={document} height={"200px"}></iframe>
        </div>
      </div>

      <button
        onClick={() =>
          changeDocument(getDocument({ js: transformCode(js), html, css }))
        }
      >
        Submit
      </button>
    </>
  );
}

export default App;
