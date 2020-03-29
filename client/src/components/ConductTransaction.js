import React, { Component } from 'react';
import { FormGroup, FormControl, Button, ControlLabel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import history from '../history';
import Cookies from 'universal-cookie';   

const cookies = new Cookies();

// import { DatePicker } from "react-bootstrap-date-picker";

class ConductTransaction extends Component {
  state = { sender: '', finInstNum: '', tranNum: '', accountId: '' , amount: 0, date: '', recipient: '', recAccId: '', recFinInstNum: '', senderError: '', finInstNumError: '', tranNumError: '', accountIdError: ''};

  componentDidMount() {
    fetch(`${document.location.origin}/api/known-addresses`)
      .then(response => response.json())
      .then(json => this.setState({ knownAddresses: json }));
    
      this.setState({recAccId: cookies.get('accountId'), recipient: cookies.get('name'), recFinInstNum: cookies.get('finInstNum')});
  }

  updateFinInstNum = event => {
    this.setState({ finInstNum: event.target.value });
  }

  updatetranNum = event => {
    this.setState({tranNum: event.target.value});
  }

  updateAccountId = event => {
    this.setState({ accountId: event.target.value });
  }

  updateAmount = event => {
    this.setState({amount: Number(event.target.value)});
  }

  updateSender = event => {
    this.setState({ sender: event.target.value });
  }

  updateDate = event => {
    this.setState({
      date: event.target.value, // YYYY-MM-DD
    });
  }

  validate = () => {
    let isError = false;

    if(!this.state.sender){
      isError = true;
      this.setState({ senderError: "Enter recipient name" });
    }

    if(!this.state.sender.match(/^[a-zA-Z ]*$/)){
      isError = true;
      this.setState({ senderError: "Enter only letters" });
    }

    if(!this.state.finInstNum){
      isError = true;
      this.setState({ finInstNumError: "Enter financial instition No" });
    }

    if(!this.state.tranNum){
      isError = true;
      this.setState({ tranNumError: "Enter transit No" });
    }


   if(!this.state.accountId){
      isError = true;
      this.setState({ accountIdError: "Enter accountId No" });
    }

    return isError;
  };


  callTransact({recipient, amount, finInstNum, accountId, tranNum, date, recFinInstNum, postDate}) {
    // API call to transact to create a transaction
    fetch(`${document.location.origin}/api/transact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipient, amount, finInstNum, accountId, tranNum, date, recFinInstNum, postDate })
      }).then(response => response.json())
      .then(json => {

        history.push('/transaction-pool');

      });
  }

  conductTransaction = () => {
    const error = this.validate();
    let errors = [
      this.state.senderError,
      this.state.finInstNumError,
      this.state.tranNumError,
      this.state.accountIdError
    ];

    console.log(this.state.senderError);

    if(error) {
      alert("Fail, please enter valid information");
      this.setState({recipient: '', finInstNum: '', tranNum: '', accountId: '', amount: 0, date: '', senderError: '', finInstNumError: '',tranNumError:'', accountIdError: ''});
    }
    else{
      const { sender, finInstNum, tranNum, accountId, amount, date, recFinInstNum } = this.state;

      // Check if the cheque is valid through second node (second node calls api)
      fetch('http://3.12.159.16:3000', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ amount, finInstNum, tranNum, accountId, date })
      }).then(response => response.json())
        .then(resp => {

          // If the response says its processed, then date is correct
          if (resp.processed == true) {

            // This is when account is not valid
            if(resp.accountvalid == false) {
              alert("Account not valid");
              this.callTransact({recipient: this.state.recAccId, accountId, amount: 0, finInstNum, tranNum, date, recFinInstNum, postDate: false });
            }
            // This is when amount is not valid
            else if(resp.amountvalid == false) {
              alert("Non sufficient funds");
              this.callTransact({recipient: this.state.recAccId, accountId, amount: 0, finInstNum, tranNum, date, recFinInstNum, postDate: false });
            }
            // This is when all conditions are good, call transact
            else {
              alert("Transaction cleared");
              this.callTransact({recipient: this.state.recAccId, accountId, amount, finInstNum, tranNum, date, recFinInstNum, postDate: false});
            }
          }
          // When cheque is post dated
          else {
            alert("Will be processed on " + resp.date);
            this.callTransact({recipient: this.state.recAccId, accountId, amount, finInstNum, tranNum, date, recFinInstNum, postDate: true});
          }
        }).catch((error) => {
            console.log(error);
      });
    }
    
  }

  render() {
    return (
      <div className='ConductTransaction'>
        <Link to='/index'>Home</Link>
        <h3>Conduct a Transaction</h3>
        <br />
        <h4>Recipient Information</h4>
        <div className='Info'>
          <div>Name: {this.state.recipient}</div>
          <div>Account ID: {this.state.recAccId}</div>
          <div>Financial Institution Number: {this.state.recFinInstNum}</div>
        </div>
        <br />
        <FormGroup>
          <ControlLabel>Sender</ControlLabel>
          <FormControl
            input='text'
            placeholder='sender'
            value={this.state.sender}
            onChange={this.updateSender}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Financial Institution Number</ControlLabel>
          <FormControl
            input='text'
            placeholder='financial institution number'
            value={this.state.finInstNum}
            onChange={this.updateFinInstNum}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Transit Number</ControlLabel>
          <FormControl
            input='text'
            placeholder='transit number'
            value={this.state.tranNum}
            onChange={this.updatetranNum}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Account ID</ControlLabel>
          <FormControl
            input='text'
            placeholder='account id'
            value={this.state.accountId}
            onChange={this.updateAccountId}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Amount</ControlLabel>
          <FormControl
            input='number'
            placeholder='amount'
            value={this.state.amount}
            onChange={this.updateAmount}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Date</ControlLabel>
          <FormControl
            input='text'
            placeholder='date'
            value={this.state.date}
            onChange={this.updateDate}
          />
        </FormGroup>
        {/* Following is for datepicker to be added later */}
        {/* <FormGroup>
          <ControlLabel>Date</ControlLabel>
          <DatePicker id="datepicker" value={this.state.date} onChange={this.updateDate} />
        </FormGroup> */}
        <div>
          <Button
            bsStyle="danger"
            onClick={this.conductTransaction}
          >
            Submit
          </Button>
        </div>
      </div>
    )
  }
};

export default ConductTransaction;