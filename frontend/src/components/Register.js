import React, { Component } from "react";
import AppNavbar from "./AppNavbar";
import {
  Container,
  Button,
  Form,
  Row,
  Col,
  FormGroup,
  Input,
  Label,
  FormFeedback,
  Alert
} from "reactstrap";

var PhoneNumber = require("awesome-phonenumber");
var imgStyle = {
  display: "inline"
};

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      fname: "",
      lname: "",
      phone: "",
      email: "",
      emailValid: true,
      phoneValid: true,
      formValid: true,
      submitSuccess: false,
      message: "This needs to be a valid UWEC email address."
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    fetch("http://api.parkingnotifier.com/stats")
      .then(res => res.json())
      .then(result => {
        this.setState({
          count: result.count
        });
      });
  }

  handleSubmit = event => {
    event.preventDefault();
    var pn = new PhoneNumber(this.state.phone, "US");
    if (this.state.emailValid && pn.isValid()) {
      this.setState({ formValid: true });
      console.log("updated the image");
      this.registerUser();
    }
  };

  registerUser() {
    var pn = new PhoneNumber(this.state.phone, "US");
    fetch("http://api.parkingnotifier.com/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        firstName: this.state.fname,
        lastName: this.state.lname,
        username: this.state.email,
        phoneNumber: pn.getNumber()
      })
    })
      .then(res => res.json())
      .then(data => {
        if (!data.success) {
          this.setState({
            formValid: false,
            message: "This email has already been taken."
          });
        } else {
          this.setState({ submitSuccess: true });
        }
      });
  }

  handleInput = e => {
    const key = e.target.name;
    const value = e.target.value;
    this.setState({ [key]: value }, () => {
      this.validateField(key, value);
    });
  };

  validateField = (FieldName, value) => {
    switch (FieldName) {
      case "email":
        this.validateEmail(value);
        break;
      case "phone":
        this.validatePhone(value);
        break;
      default:
        break;
    }
  };

  validatePhone = value => {
    var pn = new PhoneNumber(this.state.phone, "US");
    if (!pn.isValid()) {
      this.setState({ phoneValid: false });
    } else {
      this.setState({ phoneValid: true });
    }
  };

  validateEmail = value => {
    if (value.length > 0 && /@uwec.edu\s*$/.test(value)) {
      this.setState({ emailValid: true });
    } else {
      this.setState({ emailValid: false });
    }
  };

  render() {
    return (
      <div>
        <AppNavbar />
        <div className="container navbar-offset" />
        <div className="row">
          <div className="col align-self-center">
            <Container>
              <h2> Register to Receive Text Alerts</h2>
              <h6>
                When you register with the Parking Notifier, you will receive a
                text message when alternate side parking takes effect. It'll
                tell you which side of the street to park on and when the rules
                will end (3 days after the start of the rules).
              </h6>
              <div className="statCard">
                <h4>
                  Join{" "}
                  {this.state.count
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                  others receiving text alerts.
                </h4>
              </div>
            </Container>
            {this.state.submitSuccess ? (
              <Container>
                <Alert color="success">
                  <h5 className="alert-heading">
                    We've sent a confirmation email to {this.state.email}. Click
                    the link in the email to complete the registration process.
                  </h5>
                </Alert>
              </Container>
            ) : (
              <Form onSubmit={this.handleSubmit}>
                {this.state.formValid ? (
                  ""
                ) : (
                  <Alert className="text-center" color="danger">
                    {this.state.message}
                  </Alert>
                )}

                <Label htmlFor="frmNameA">Name</Label>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Input
                        type="text"
                        name="fname"
                        id="frmNameA"
                        placeholder="First"
                        required
                        autoComplete="given-name"
                        value={this.state.fname}
                        onChange={event => this.handleInput(event)}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Input
                        id="lName"
                        name="lname"
                        type="text"
                        placeholder="Last"
                        required
                        autoComplete="family-name"
                        value={this.state.lname}
                        onChange={event => this.handleInput(event)}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <FormGroup>
                  <Label>Phone Number</Label>
                  <Input
                    required
                    type="tel"
                    className="form-control"
                    id="phoneNumber"
                    name="phone"
                    value={this.state.phone}
                    onChange={event => this.handleInput(event)}
                    invalid={!!!this.state.phoneValid}
                  />
                  <FormFeedback>Must be a valid phone number</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label>UWEC Email</Label>
                  <Input
                    name="email"
                    type="email"
                    required
                    placeholder="username@uwec.edu"
                    autoComplete="email"
                    value={this.state.email}
                    onChange={event => this.handleInput(event)}
                    invalid={!!!this.state.emailValid}
                  />
                  <FormFeedback>Must be a valid UWEC email.</FormFeedback>
                </FormGroup>
                <Button outline block color="primary" type="submit">
                  Register
                </Button>
              </Form>
            )}
          </div>
          <div
            id="exampleContainer"
            className="col align-self-center"
            style={imgStyle}
          >
            <img
              src={require("../media/demo_text_2.png")}
              className="text-example-img"
              alt="Text Message Example"
            />
          </div>
        </div>
      </div>
    );
  }
}
export default Register;
