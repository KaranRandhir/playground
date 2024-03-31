const DEFAULT_HTML = `<div id="container">
  <h1>Welcome to JS playground</h1>
  <p>Changes will be refelected here</p>
</div>

`

const DEFAULT_CSS = `body {
  background-color: hsl(197, 93%, 37%);
  text-align: center;
  color: white;
}`

const DEFAULT_JS = `console.log("Hello World")`

const RIGHT_PANEL_MODES = {
  OUTPUT:"OUTPUT",
  LOGS:"LOGS"
}

export {DEFAULT_HTML,DEFAULT_JS,DEFAULT_CSS,RIGHT_PANEL_MODES}