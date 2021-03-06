import React, { Component } from "react";
import { Container, Alert } from "reactstrap";
import AppNavbar from "./AppNavbar";
import { getAPI } from "./helpers/api";

class ConfirmEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    getAPI()
      .post(`/confirmation/${this.props.match.params.code}`)
      .then(res => {
        if (!res.data.success) {
          this.setState({
            confirmed: false,
            message:
              "Sorry! It looks like you have already confirmed your email or the confirmation link you just used was old. Please check your inbox for a more recent confirmation email",
            color: "info"
          });
        } else {
          this.setState({
            confirmed: true,
            message:
              "Your email is confirmed. You are now subscribed to the Parking Notifier",
            color: "success"
          });
        }
      })
      .catch(err => {
        this.setState({
          confirmed: false,
          message:
            "Sorry! It looks like you have already confirmed your email or the confirmation link you just used was old. Please check your inbox for a more recent confirmation email",
          color: "info"
        });
      });
  };

  render() {
    return (
      <div>
        <AppNavbar />
        <div className="container navbar-offset" />
        <Container>
          <Alert color={this.state.color}>{this.state.message}</Alert>
        </Container>
      </div>
    );
  }
}

export default ConfirmEmail;
