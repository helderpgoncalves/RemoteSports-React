import React, { Component } from "react";
import { auth, db } from "../../firebase";
import AsyncSelect from "react-select/async";
import { Button, TableRow, TextField } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import ClassIcon from "@material-ui/icons/Class";
import { DeleteOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import CreateLesson from "../CreateLesson/CreateLesson";
import { v4 as uuidv4 } from "uuid";

class MenuProfessor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      students: [],
      nameClass: "",
    };
  }

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
      students: [...this.state.students, tags],
    });
  };

  handleDeleteRow = (e) => {
    var array = [...this.state.students]; // make a separate copy of the array

    array.splice(e, 1);

    this.setState({
      students: array,
    });
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  createTurma = (e) => {
    e.preventDefault();

    const turma = this.state;

    var docRef = db.collection("users").doc(auth.currentUser.uid);
    docRef
      .get()
      .then(function (doc) {
        if (doc.exists) {
          var docRef2 = db.collection("classes").doc(uuidv4());

          docRef2
            .set({
              students: turma.students,
              school: doc.data().school,
              professor: doc.data().email,
              name: turma.nameClass.toUpperCase(),
            })
            .then(function () {
              toast.success(`🤪 Excellent! You create new class!`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            })
            .catch(function (error) {
              console.error("Error writing document: ", error);
              toast.error(error);
            });
        } else {
          console.log("No such document!");
        }
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
        toast.error(error);
      });
  };

  getRows = () => {
    let rows = [];

    if (this.state.students)
      this.state.students.map((element) => {
        rows.push(
          <TableRow key={element.label}>
            <TableCell>{element.name}</TableCell>
            <TableCell>{element.label}</TableCell>
            <TableCell>{element.school}</TableCell>
            <TableCell>
              <Button onClick={(element) => this.handleDeleteRow(element)}>
                <DeleteOutlined />
              </Button>
            </TableCell>
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
        <div className="pl-5 pr-5 pt-4">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>School</TableCell>
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{this.getRows()}</TableBody>
          </Table>
          <br />
          <form>
            <TextField
              id="mainInput"
              fullWidth
              required
              margin="normal"
              variant="outlined"
              type="text"
              name="nameClass"
              onChange={(e) => this.handleChange(e)}
              label="Class Name"
            />
            <Button
              onClick={(e) => this.createTurma(e)}
              disabled={
                Object.keys(this.state.students).length == 0 ||
                !this.state.nameClass
              }
              variant="contained"
              color="primary"
              size="large"
              startIcon={<ClassIcon />}
            >
              CREATE CLASS
            </Button>
          </form>
        </div>
        <div className="pt-0">
          <CreateLesson />
        </div>
      </>
    );
  }
}

export default MenuProfessor;
