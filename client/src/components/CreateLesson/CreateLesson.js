import React, { Component } from "react";
import ICalendarLink from "react-icalendar-link";
import TextField from "@material-ui/core/TextField";
import { Button } from "@material-ui/core";
import { toast } from "react-toastify";
import Modal from "react-awesome-modal";
import iCalendar from "../../assets/iCalendar.png";
import ScheduleIcon from "@material-ui/icons/Schedule";
import AddToGoogleCalendar from "../Calendar/AddToGoogleCalendar";
import "./CreateLesson.css";
import { db } from "../../firebase";
import AsyncSelect from "react-select/async";

export default class CreateLesson extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      location: window.location.origin,
      attendees: [],
    };
  }

  openModal() {
    this.setState({
      visible: true,
    });
  }

  closeModal() {
    this.setState({
      visible: false,
    });

    toast.success(`🧑🏼‍🏫 Class Schedule Create with Success!`, {
      position: "top-right",
      autoClose: 7000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  loadOptions = async (inputValue) => {
    inputValue = inputValue.toUpperCase().replace(/\W/g, " ");
    return new Promise((resolve) => {
      db.collection("classes")
        .orderBy("name")
        .startAt(inputValue)
        .endAt(inputValue + "\uf8ff")
        .get()
        .then((docs) => {
          if (!docs.empty) {
            let recommendedTags = [];
            docs.forEach(function (doc) {
              //  console.log(doc.data().students);
              const tag = {
                label: doc.data().name,
                students: doc.data().students,
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

    const students = tags.students.map(function (item) {
      return {email: item["label"]};
    });

 //   console.log(students);
    
    this.setState({
      attendees: [...this.state.attendees, students],
    });

  //  console.log(this.state.attendees)
  };

  handleChange = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({ [nam]: val });
  };

  classCreate = (e) => {
    e.preventDefault();

    this.openModal();
  };

  render() {
    const dados = this.state;

    // Formato para Exportar para o iCalendar
    const ical = {
      title: dados.title,
      description: dados.description,
      location: "",
      startTime: dados.startTime,
      endTime: dados.endTime,
    };

    return (
      <>
        <div className="card1 card-2">
          <form onSubmit={this.classCreate} style={{ margin: "20px" }}>
            <AsyncSelect
              placeholder="Classe"
              loadOptions={this.loadOptions}
              onChange={this.handleOnChange}
            />

            <br />

            <TextField
              id="cadeira"
              fullWidth
              margin="normal"
              variant="outlined"
              type="text"
              label="Curricular Unit"
              name="title"
              required
              value={this.state.title}
              onChange={this.handleChange}
            />

            <br />

            <TextField
              id="descricao"
              fullWidth
              margin="normal"
              type="text"
              variant="outlined"
              label="Class Description"
              name="description"
              onChange={this.handleChange}
            />

            <br />
            <br />

            <TextField
              fullWidth
              variant="outlined"
              required
              id="datetime-local"
              label="Class Schedule Start"
              onChange={this.handleChange}
              type="datetime-local"
              name="startTime"
              defaultValue=""
              InputLabelProps={{
                shrink: true,
              }}
            />
            <br />
            <br />
            <TextField
              fullWidth
              variant="outlined"
              required
              id="datetime"
              label="Class Schedule End"
              onChange={this.handleChange}
              type="datetime-local"
              name="endTime"
              defaultValue=""
              InputLabelProps={{
                shrink: true,
              }}
            />
            <br />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<ScheduleIcon />}
              style={{ margin: "20px" }}
            >
              Create Lesson
            </Button>
          </form>
        </div>
        <div className="iCalendar">
          <Modal
            visible={this.state.visible}
            width="400"
            height="380"
            effect="fadeInUp"
            onClickAway={() => this.closeModal()}
          >
            <div className="pb-3">
              <h3 className="pt-3">Success Creating the Class</h3>
              <img style={{ width: "35%" }} src={iCalendar} alt="iCalendar" />
              <br />
              <Button variant="contained" color="primary">
                <ICalendarLink style={{ color: "white" }} event={ical}>
                  Export to iCalendar
                </ICalendarLink>
              </Button>
              <br /> <br />
              <AddToGoogleCalendar data={this.state} />
              <br />
            </div>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => this.closeModal()}
            >
              Close
            </Button>
          </Modal>
        </div>
      </>
    );
  }
}
