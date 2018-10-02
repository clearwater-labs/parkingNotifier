import React, { Component } from 'react';
import './App.css';
import { Button } from "react-bootstrap";
import 'reactstrap';
<<<<<<< HEAD
<<<<<<< HEAD
import InputMask from 'react-input-mask';
=======
const axios = require('axios')
>>>>>>> 0c227a7e6870732f1d05dc0f63137aafb5b6f741
=======
const axios = require('axios')
>>>>>>> 0c227a7e6870732f1d05dc0f63137aafb5b6f741


class App extends Component {
  constructor(props) {
      super(props);

      this.state = {
        name: "",
        phoneNumber: "",
        username: "",
        data: []
      };
  }

  componentDidMount() {
    axios.get('http://localhost:9000/users')
    .then(res => {
      console.log(res.data)
      console.log(res.data[0])
      this.setState({
        data: [...res.data]
      })
      console.log(this.state)
    })
    
  }

  validateForm() {
    return this.state.name.length > 0 && this.state.phoneNumber.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = event => {
     axios.post(`http://localhost:9000/users/${this.state.username}`, {
       params: {
         firstName: this.state.name,
         phoneNumber: this.state.phoneNumber,
         username: this.state.username
       }
     })
     .then(res => {
       console.log(res)
     })
     .catch(err => {
       console.log(err)
     })
  }

  render() {
    const listData = this.state.data.map(item => <div>
        <ul>
          <li>{item.firstName + " " + item.lastName}</li>
          <li>{item.phone}</li>
          <li>{item.username}</li>
        </ul>
      </div>);
    return (
<div className="App">
    <div className="content">
    <img src={require('./studentsenate_logo.png')} className="img-responsive" id="StudentSenateLogo" alt="StudentSenateLogo"/>
    </div>
    <div className="container">
        <h3> UWEC Parking Notifier Sign-up </h3>
        <p> During a snow emergency, the City of Eau Claire
        will activate alternate side parking rules. Complete
        the form below to sign up for text alerts when alternate
        side parking is in effect. </p>

        <form onSubmit={this.handleSubmit}>
        <label for="name" id="nameLabel"> Name </label>
    <div className="form-group" id="firstAndLastName">
		  <input type="name" class="form-control" autoFocus id="firstName" placeHolder="First" onChange={this.handleChange}/>
		  <input type="name" class="form-control" id="lastName" placeHolder="Last" onChange={this.handleChange}/>
		</div>
		<div class="form-group">
			<label for="phoneNumber"> Phone Number </label>
			<InputMask mask="999-999-9999" type="tel" class="form-control" id="phoneNumber"/>
		</div>
		<div class="form-group">
			<label for="email"> UWEC Email </label>
			<input type="email" class="form-control" id="email"/>
    </div>
      <Button block type="submit" bsSize="large" disabled={!this.validateForm()}> Submit </Button>

    </form>
    </div>

          <footer>

          <small> This page is brought to you by the UWEC
          Student Senate and Information Technology Commission </small>
          </footer>

          {listData}

          </div>
    );
  }
}

export default App;
