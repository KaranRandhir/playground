import React from "react";
import "./Header.css";
const Header = ({buttonConfig}) => {
  return (
    <header class="dark-header">
      <div class="header-title">Simple Playground</div>
      <div class="header-buttons">
        <button>RUN</button>
        <button>SAVE</button>
      </div>
    </header>
  );
};

export default Header;


