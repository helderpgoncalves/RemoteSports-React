import React, {Component} from 'react';
import WeekView from './weekView';
import CalendarEventHandler from './calendarEventHandler';
import { auth, db } from "../../firebase"

class GoogleCalendar extends Component {
  constructor (props) {
    super (props);

    this.state = {
      events: JSON.parse (localStorage.getItem ('events')) || {},
    };

    // saving data to the local storage
    window.addEventListener ('beforeunload', () => {
      localStorage.setItem ('events', JSON.stringify (this.state.events));
    });
  }

  componentDidMount() {
    const lessons = 
  }

  addNewEvent = event => {
    event = {
      ...event,
      id: CalendarEventHandler.generateId (event),
    };
    this.setState (previousSate => ({
      events: CalendarEventHandler.add (previousSate.events, event),
    }));
  };

  updateEvent = (eventId, updatedEvent) => {
    this.setState (previousState => {
      return {
        events: CalendarEventHandler.update (
          eventId,
          updatedEvent,
          previousState.events
        ),
      };
    });
  };

  deleteEvent = eventId => {
    this.setState (previousState => {
      return {
        events: CalendarEventHandler.delete (eventId, previousState.events),
      };
    });
  };

  render () {
    const {events} = this.state;
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
