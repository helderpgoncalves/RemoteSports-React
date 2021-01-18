import React, { Component, useState } from "react";
import WeekView from "./weekView";
import CalendarEventHandler from "./calendarEventHandler";
import { auth, db } from "../../firebase";
import { toast } from "react-toastify";

class GoogleCalendar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
    };
  }

  componentDidMount() {
    try {
      const serializedState = localStorage.getItem("isTeacher");
      const serializedEmail = localStorage.getItem("email");
      if (serializedState === null) {
        return undefined;
      }
      const isTeacher = JSON.parse(serializedState);
      if (isTeacher == "true") {
        const eventsRef = db
          .collection("lessons")
          .where("professor", "==", serializedEmail);
        eventsRef
          .get()
          .then(function (querySnapshot) {
            var events = [];
            querySnapshot.forEach(function (doc) {
              console.log(doc.data);
              events.push(doc.data().event);
              // ?   localStorage.setItem("events", JSON.stringify(doc.data().event));
            });
            this.setState({
                events: [...this.state.events, events]
              }) 
          })
          .catch(function (error) {
            console.log("Error getting documents: ", error);
          });
      }
    } catch (error) {
      console.log(error);
    }
  }

  addNewEvent = (event) => {
    console.log(event);
    const serializedEmail = localStorage.getItem("email");
    const serializedTipoConta = localStorage.getItem("isTeacher");

    const isTeacher = JSON.parse(serializedTipoConta);
    if (isTeacher == "true") {
      event = {
        ...event,
        id: CalendarEventHandler.generateId(event),
      };
      this.setState((previousSate) => ({
        events: CalendarEventHandler.add(previousSate.events, event),
      }));

      db.collection("lessons")
        .doc(event.id)
        .set({
          event: event,
          professor: serializedEmail,
        })
        .then(function () {
          toast.success(`🤪 Excellent! You create new Lesson!!`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
    } else {
      toast.error(`🤪 You don't have permissions to create a lesson!`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  updateEvent = (eventId, updatedEvent) => {
    this.setState((previousState) => {
      return {
        events: CalendarEventHandler.update(
          eventId,
          updatedEvent,
          previousState.events
        ),
      };
    });
  };

  deleteEvent = (eventId) => {
    this.setState((previousState) => {
      return {
        events: CalendarEventHandler.delete(eventId, previousState.events),
      };
    });
  };

  render() {
    const { events } = this.state;
    return (
      <WeekView
        events={events}
        onNewEvent={this.addNewEvent}
        onEventUpdate={this.updateEvent}
        onEventDelete={this.deleteEvent}
      />
    );
  }
}

export default GoogleCalendar;
