import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import { GoogleOutlined } from "@ant-design/icons";
import "./GetGoogleCalendar.css";

function GetGoogleCalendar() {
  var gapi = window.gapi;

  const [events, setEvents] = useState([]);

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
          // get events
          gapi.client.calendar.events
            .list({
              calendarId: "primary",
              timeMin: new Date().toISOString(),
              showDeleted: false,
              singleEvents: true,
              maxResults: 10,
              orderBy: "startTime",
            })
            .then((response) => {
              const result = response.result.items;

              console.log(result);

              setEvents(result);
            });
        });
    });
  };

  return (
    <>
      <div id="background">
        <div id="container1" className="pt-5 text-center pb-5">
          <Button
            className=""
            onClick={handleClick}
            variant="contained"
            color="secondary"
            startIcon={<GoogleOutlined />}
            size="large"
            disabled={events.length > 0}
          >
            GET EVENTS
          </Button>
        </div>
        <div id="container2" className="pb-4">
          {events.length == 0 && (
            <h1 className="pt-5 text-center" style={{ color: "white" }}>
              No events available!
            </h1>
          )}

          {events.map((item) => {
            return (
              <>
                <div className="pt-5">
                  <div id="container">
                    <h4 style={{ color: "red" }}>{item.summary}</h4>
                    <h5>Creator: {item.creator.email}</h5>
                    <h5>Start Time:{item.start.dateTime}</h5>
                    <h5>Status: {item.status}</h5>
                    <Button href={item.htmlLink} startIcon={<GoogleOutlined />}>
                      Link to Google Calendar
                    </Button>
                  </div>
                </div>
              </>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default GetGoogleCalendar;
