import React, { Component } from "react";
import { db } from "../../firebase";
import AsyncSelect from "react-select/async";
import { Button, TableRow } from "@material-ui/core";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";

import { DeleteOutlined } from "@ant-design/icons";
import ICalendar from "../iCalendar/ICalendar";

class MenuProfessor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTag: [],
      data: [],
    };
  }

  mySubmitHandler = (event) => {
    const docRef = db.collection("users").doc(event.value);

    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          this.state.data.push(doc.data());
        } else {
          console.log("No such document!");
        }
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });
  };

  loadOptions = async (inputValue) => {
    inputValue = inputValue.toLowerCase().replace(/\W/g, "");
    return new Promise((resolve) => {
      db.collection("users")
        .orderBy("email")
        .startAt(inputValue)
        .endAt(inputValue + "\uf8ff")
        .get()
        .then((docs) => {
          if (!docs.empty) {
            let recommendedTags = [];
            docs.forEach(function (doc) {
              const tag = {
                email: doc.data().email,
                name: doc.data().name,
                school: doc.data().school,
                value: doc.id,
                label: doc.data().email,
              };
              recommendedTags.push(tag);
            });
            return resolve(recommendedTags);
          } else {
            return resolve([]);
          }
        });
    });
  };

  handleOnChange = (tags) => {
    this.setState({
      selectedTag: [tags],
    });
  };

  handleDeleteRow =(e)  => {
    var array = [...this.state.selectedTag]; // make a separate copy of the array
    var index = array.indexOf(e.target.value);
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({ selectedTag: array });
    }
  }

  getRows = () => {
    let rows = [];

    if (this.state.selectedTag)
      this.state.selectedTag.map((element) => {
        rows.push(
          <TableRow key={element.id}>
            <td>{element.name}</td>
            <td>{element.email}</td>
            <td>{element.school}</td>
            <td>
              <Button onClick={(element) => this.handleDeleteRow(element)}>
                <DeleteOutlined />
              </Button>
            </td>
          </TableRow>
        );
      });
    return rows;
  };

  render() {
    return (
      <>
        <div className="pl-5 pr-5">
          <h3>Search Student by Email:</h3>
          <AsyncSelect
            loadOptions={this.loadOptions}
            onChange={this.handleOnChange}
          />
        </div>
        <div className="pl-5 pr-5 pt-5">
          <h4 className="text-center">CLASS</h4>
          <Table>
            <thead>
              <TableRow>
                <th>Name</th>
                <th>Email</th>
                <th>School</th>
                <th>Delete</th>
              </TableRow>
            </thead>
            <TableBody>{this.getRows()}</TableBody>
          </Table>
        </div>
        <ICalendar />
      </>
    );
  }
}

export default MenuProfessor;
