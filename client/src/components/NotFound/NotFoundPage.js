import React, { Component } from 'react';
import { CSSTransition } from 'react-transition-group';
import Link from "@material-ui/core/Link";
import { withRouter } from 'react-router-dom';

import './NotFoundPage.scss';
  
import fourOhFour from '../../assets/fourOhFour.svg';
import logo from '../../assets/banner.png';

class NotFoundPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageLoaded: false,
      fourOhFourLoaded: false,
      astrotop: "0px",
      astroright: "0px",
    };
  }
  componentDidMount() {
    this.setState({
      pageLoaded: true,
    });
  }
  onMouseMove(e) {
    this.setState({
      astrotop: e.clientY / 8 + "px",
      astroright: e.clientX / 8 + "px",
    });
  }

  redirectToHome = () => {
    const { history } = this.props;
    if(history) history.push('/');
   }

  render() {

    const { history } = this.props;

    return (
      <div className="flex main-wrap justifyCenter">
        <div className="main-container flex">
          <CSSTransition
            in={this.state.pageLoaded}
            timeout={600}
            classNames="fourOhFour"
            onEntered={() => {
              this.setState({
                fourOhFourLoaded: true,
                astrotop: "5px",
                astroright: "5px",
              });
            }}
            unmountOnExit
          >
            {(state) => (
              <div
                className="fourOhFour flex justifyCenter"
                onMouseMove={(e) => {
                  this.onMouseMove(e);
                }}
                onMouseOut={() => {
                  this.setState({ astrotop: "10px", astroright: "30px" });
                }}
              >
                <img src={fourOhFour} />
                <img
                  src={logo}
                  className="astrodude"
                  style={{
                    width: 180,
                    paddingTop: this.state.astrotop,
                    paddingRight: this.state.astroright,
                  }}
                />
              </div>
            )}
          </CSSTransition>
          <CSSTransition
            in={this.state.fourOhFourLoaded}
            timeout={600}
            classNames="error-text"
            unmountOnExit
          >
            {(state) => (
              <div className="error-text flex justifyCenter">
                <h3>Oops… Looks like you got lost</h3>
                <Link to="/" onClick={this.redirectToHome}>HOME</Link>
              </div>
            )}
          </CSSTransition>
        </div>
      </div>
    );
  }
}

export default withRouter(NotFoundPage);       
