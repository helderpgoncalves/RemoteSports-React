import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import { v1 as uuid } from "uuid";
import logo from "../../assets/logo_transparent.png";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(5, 0, 5),
  },
  heroButtons: {
    marginTop: theme.spacing(5),
  },
}));

export default function Album() {
  const classes = useStyles();
  let history = useHistory();

  const create = () => {
    const id = uuid();
    history.push(`/room/${id}`);
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <main>
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              RemoteSports
              <img
                className="pt-0"
                style={{ width: "40%" }}
                src={logo}
                alt="Logo"
              />
            </Typography>
            <Typography
              variant="h5"
              align="justify"
              color="textSecondary"
              paragraph
            >
              RemoteSports provides you with a reliable and secure connection
              for your online classes that is and will always be 100% free. We
              work to ensure that your online classes will have all the features
              required to shorten the difference between real life and online.
              With multiple cameras active your students won't miss out on any
              part of the class due to camera limits and with calendar
              scheduling they will never miss a class itself!
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Button variant="contained" color="primary" onClick={create}>
                    Start Meeting
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" color="primary">
                    <Link to="/register"></Link>Explore
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
      </main>
    </React.Fragment>
  );
}
