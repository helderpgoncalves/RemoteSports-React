import React, { useState } from "react";
import { auth, provider } from "../../firebase";
import { toast } from "react-toastify";
import { Button } from "antd";
import Avatar from "@material-ui/core/Avatar";
import { MailOutlined, GoogleOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import "../../css/Login.css";
import { Link } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import logo from "../../assets/logo_transparent.png";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    width: "30%",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Login = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const classes = useStyles();

  let dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await auth.signInWithEmailAndPassword(email, password);

      const { user } = result;
      const idTokenResult = await user.getIdTokenResult();

      dispatch({
        type: "LOGGED_IN_USER",
        payload: {
          email: user.email,
          token: idTokenResult.token,
        },
      });

      history.push("/mainpage");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const googleLogin = async () => {
    await auth
      .signInWithPopup(provider)
      .then(async function (result) {
        const { user } = result;
        const idTokenResult = await user.getIdTokenResult();

        dispatch({
          type: "LOGGED_IN_USER",
          payload: {
            email: user.email,
            token: idTokenResult.token,
          },
        });

        history.push("/mainpage");
      })
      .catch(function (error) {
        toast.error(error.message);
      });
  };

  const LoginForm = () => (
    <div className="pt-5">
    <Container component="main" maxWidth="xs" id="login-container">
      <div className={classes.paper}> 
        <Avatar
          alt="Remy Sharp"
          src={logo}
          className={classes.avatar}
          variant="rounded"
        />
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            fullWidth
            required
            margin="normal"
            variant="outlined"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            label="Email Address"
          />
          <TextField
            fullWidth
            required
            margin="normal"
            variant="outlined"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
          />

          <br />
          <Button
            onClick={handleSubmit}
            type="primary"
            className={classes.submit}
            shape="round"
            block
            icon={<MailOutlined />}
            size="large"
            disabled={!email || password.length < 6}
          >
            Login with Email/Password
          </Button>
          <Button
            onClick={googleLogin}
            type="danger"
            className={classes.submit}
            shape="round"
            block
            icon={<GoogleOutlined />}
            size="large"
          >
            Google Account Login
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to="/forgot/password" variant="body2" className="text-danger">
                Forgot Password
              </Link>
            </Grid>
            <Grid item>
              <Link to="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
    </div>
  );

  return <div className="wrapper">{LoginForm()}</div>;
};

export default Login;
