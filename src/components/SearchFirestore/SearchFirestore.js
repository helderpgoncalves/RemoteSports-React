import React, { Component } from "react";
import { db } from "../../firebase";
import AsyncSelect from "react-select/async";
import { Button } from "@material-ui/core";
import { Table } from "react-bootstrap";
import { DeleteOutlined } from "@ant-design/icons";

class SearchFirestore extends Component {
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
          // Evitar Duplicados
          // TODO //
          this.state.data.map(doc.data().email);
          console.log(this.state.data);
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

  handleDeleteRow(i) {
    console.log(i.name);
  }

  getRows = () => {
    let rows = [];

    if (this.state.data)
      this.state.data.map(element => {
        rows.push(
          <tr key={element}>
            <td>{element.name}</td>
            <td>{element.email}</td>
            <td>{element.school}</td>
            <td>
              <Button onClick={(element) => this.handleDeleteRow(element)}>
                <DeleteOutlined />
              </Button>
            </td>
          </tr>
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
          {this.state.selectedTag.map((e, index) => {
            return (
              <div>
                <Button
                  onClick={this.mySubmitHandler(e)}
                  variant="contained"
                  color="primary"
                  style={{ margin: "20px" }}
                >
                  ADD STUDENT TO CLASS
                </Button>
              </div>
            );
          })}
        </div>
        <div className="pl-5 pr-5 pt-5">
          <h4 className="text-center">CLASS</h4>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>School</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
            {this.getRows()}
            </tbody>
          </Table>
        </div>
      </>
    );
  }
}

export default SearchFirestore;
