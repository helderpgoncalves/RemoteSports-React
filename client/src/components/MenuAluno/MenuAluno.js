import React, { Component } from "react";
import GetGoogleCalendar from "../Calendar/GetGoogleCalendar";
class MenuAluno extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <GetGoogleCalendar />
      </>
    );
  }
}

export default MenuAluno;
