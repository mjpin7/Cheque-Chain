import React, { Component } from "react";
import { FormGroup, FormControl, Button, ControlLabel } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie'; 

const cookies = new Cookies(); 

const formValid = ({ formErrors, ...rest }) => {
  let valid = true;

  // validate form errors being empty
  Object.values(formErrors).forEach(val => {
    val.length > 0 && (valid = false);
  });

  // validate the form was filled out
  Object.values(rest).forEach(val => {
    val === null && (valid = false);
  });

  return valid;
};

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: cookies.get('name') || "",
      accountId: "",
      formErrors: {
        name: "",
        accountId: ""
      },
      redirect: false
    };
  }

  handleSubmit = e => {
    e.preventDefault(); 
    if (formValid(this.state)) {
      console.log(`
        --SUBMITTING--
        Name: ${this.state.name}
        Account Id: ${this.state.accountId}
      `);
      
      
      this.setState({redirect: true})

    } else {
      console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
    }
  };

  updateName = event => {
      cookies.set('name', event.target.value, { path: '/' }); 
      this.setState({ name: event.target.value })
  }

  updateAccountId = event => {
    cookies.set('accountId', event.target.value, { path: '/' });
    this.setState({ accountId: event.target.value })
  }

  renderRedirect = () => {
      if(this.state.redirect) {
          return (<Redirect to={{
            pathname: '/index',
            state: { name: this.state.name, accountId: this.state.accountId }
        }} />)
      }
      else {
        return (<div>
                    <h3>Login</h3>
                    <br />
                    <FormGroup>
                        <ControlLabel>Name: </ControlLabel>
                        <FormControl
                            input='text'
                            placeholder='Name'
                            value={this.state.name}
                            onChange={this.updateName}
                        />
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Account ID</ControlLabel>
                        <FormControl
                            input='text'
                            placeholder='Account Id'
                            value={this.state.accountId}
                            onChange={this.updateAccountId}
                        />
                    </FormGroup>
                    <div>
                        <Button
                            bsStyle="danger"
                            onClick={this.handleSubmit}
                        >
                            Submit
                        </Button>
                    </div>
                </div>
            )
      }
  }

  render() {
    const { formErrors } = this.state;

    return (
      <div className="wrapper">
          {this.renderRedirect()}
    </div>
        
    );
  }
}

export default Login;
