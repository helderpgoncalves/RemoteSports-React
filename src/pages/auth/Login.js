import React, { useState } from "react";
import { auth, provider } from "../../firebase";
import { toast } from "react-toastify";
import { Button } from "antd";
import { MailOutlined, GoogleOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import "../../css/Login.css";

const Login = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // So para ser uma pouco user friendly...
  const [loading, setLoading] = useState(false);

  let dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
      toast.error(error.message);
      setLoading(false);
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
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="email"
          name="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
          placeholder="Email"
        />
      </div>
      <div className="form-group">
        <input
          type="password"
          name="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          placeholder="Password"
        />
      </div>

      <br />
      <Button
        onClick={handleSubmit}
        type="primary"
        className="mb-3"
        shape="round"
        block
        icon={<MailOutlined />}
        size="large"
        disabled={!email || password.length < 6}
      >
        Login with Email/Password
      </Button>
    </form>
  );

  return (
    <div className="wrapper">
      <div className="container p-5">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            {loading ? (
              <h3 className="text-danger">Loading...</h3>
            ) : (
              <h3>Login</h3>
            )}
            {LoginForm()}

            <Button
              onClick={googleLogin}
              type="danger"
              className="mb-3"
              shape="round"
              block
              icon={<GoogleOutlined />}
              size="large"
            >
              Google Account Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
