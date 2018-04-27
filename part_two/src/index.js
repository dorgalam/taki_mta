import React from "react";
import ReactDOM from "react-dom";
import "./style.css";

class Root extends React.Component {
  render() {
    return <div>Hi</div>;
  }
}

/* Directly adding react element */
ReactDOM.render(<Root />, document.getElementById("root"));
