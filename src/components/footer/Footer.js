import React from "react";
import "../footer/Footer.css";
import GitHub from "../../assets/GitHub_Logo_White.png";

function Footer() {
  return (
    <div className="main-footer">
      <div className="container">
        <div className="row">
          <div className="col">
            <h3>RemoteSports Team</h3>
            <ui className="list-unstyled">
              <li>
                <a
                  style={{ color: "white" }}
                  href="https://www.linkedin.com/in/heldergoncalves16/"
                >
                  HÉLDER PIMENTA GONÇALVES
                </a>
              </li>
              <li>HUGO PEREIRA</li>
            </ui>
          </div>
          <div className="col">
            <h3>Want to contribute? Great!</h3>
            <a href="https://github.com/helderpgoncalves/RemoteSports">
              <img src={GitHub} alt="github" style={{ width: "50%" }} />
            </a>
          </div>
        </div>
        <hr />
        <div className="row">
          <p className="col-sm">
            &copy;{new Date().getFullYear()} RemoteSports | <a href="http://www.ipvc.pt" style={{ color: "white" }}>Instituto Politénico
            de Viana Do Castelo</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
