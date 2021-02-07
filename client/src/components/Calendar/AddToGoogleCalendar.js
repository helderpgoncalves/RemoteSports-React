import React, { Component } from "react";
import Button from "@material-ui/core/Button";

function Calendar({ data }) {
  const dataEvent = data;

  var gapi = window.gapi;

  var CLIENT_ID =
    "402561691552-cgtpd53g0p31gt036hpufikki5dg9fth.apps.googleusercontent.com";
  var API_KEY = "AIzaSyAU52lxFjeTl9nncyf8ncaf7gzYKN6SWdw";
  var DISCOVERY_DOCS = [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
  ];
  var SCOPES = "https://www.googleapis.com/auth/calendar.events";

  const handleClick = () => {
    gapi.load("client:auth2", () => {
      console.log("loaded client");

      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      });

      gapi.client.load("calendar", "v3", () => console.log("bam!"));

      gapi.auth2
        .getAuthInstance()
        .signIn()
        .then(() => {
          var event = {
            summary: data.title,
            location: data.location,
            description: data.description,
            start: {
              dateTime: new Date(data.startTime).toISOString(),
              timeZone: "Europe/Lisbon",
            },
            end: {
              dateTime: new Date(data.endTime).toISOString(),
              timeZone: "Europe/Lisbon",
            },
            // recurrence: ["RRULE:FREQ=DAILY;COUNT=2"],
            attendees: data.attendees[0],
            reminders: {
              useDefault: false,
              overrides: [
                { method: "email", minutes: 24 * 60 },
                { method: "popup", minutes: 10 },
              ],
            },
          };

          var request = gapi.client.calendar.events.insert({
            calendarId: "primary",
            resource: event,
          });

          request.execute((event) => {
            console.log(event);
            window.open(event.htmlLink);
          });
        });
    });
  };

  return (
    <Button variant="contained" color="primary" onClick={handleClick}>
      Export to Google Calendar
    </Button>
  );
}

export default Calendar;
