import React, { Component } from 'react';
import { FormGroup, FormControl, Button, ControlLabel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import history from '../history';
import Cookies from 'universal-cookie';   

const cookies = new Cookies();

// import { DatePicker } from "react-bootstrap-date-picker";

class ConductTransaction extends Component {
  state = { recipient: '', finInstNum: '', tranNum: '', accountId: '' , amount: 0, date: '', sender: '', senderAccId: ''};

  componentDidMount() {
    fetch(`${document.location.origin}/api/known-addresses`)
      .then(response => response.json())
      .then(json => this.setState({ knownAddresses: json }));
    
      this.setState({sender: cookies.get('name'), senderAccId: cookies.get('accountId')});
  }

  updateFinInstNum = event => {
    this.setState({ finInstNum: event.target.value });
  }

  updatetranNum = event => {
    this.setState({ tranNum: event.target.value });
  }

  updateAccountId = event => {
    this.setState({ accountId: event.target.value });
  }

  updateAmount = event => {
    this.setState({ amount: Number(event.target.value) });
  }

  updateRecipient = event => {
    this.setState({ recipient: event.target.value });
  }

  updateDate = event => {
    this.setState({
      date: event.target.value, // YYYY-MM-DD
    });
  }

  callTransact({recipient, amount, finInstNum, accountId, tranNum, date}) {
    // API call to transact to create a transaction
    fetch(`${document.location.origin}/api/transact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipient, amount, finInstNum, accountId, tranNum, date })
      }).then(response => response.json())
      .then(json => {

        history.push('/transaction-pool');

      });
  }

  conductTransaction = () => {
    const { recipient, finInstNum, tranNum, accountId, amount, date } = this.state;

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
            this.callTransact({recipient, amount: 0, finInstNum, accountId, tranNum, date});
          }
          // This is when amount is not valid
          else if(resp.amountvalid == false) {
            alert("Non sufficient funds");
            this.callTransact({recipient, amount: 0, finInstNum, accountId, tranNum, date});
          }
          // This is when all conditions are good, call transact
          else {
            alert("Transaction cleared");
            this.callTransact({recipient, amount, finInstNum, accountId, tranNum, date});
          }
        }
        // When cheque is post dated
        else {
          alert("Will be processed on" + resp.date);
        }
      }).catch((error) => {
          console.log(error);
      });
  }

  render() {
    return (
      <div className='ConductTransaction'>
        <Link to='/index'>Home</Link>
        <h3>Conduct a Transaction</h3>
        <br />
        <h4>Sender Information</h4>
        <div className='Info'>
          <div>Name: {this.state.sender}</div>
          <div>Account ID: {this.state.senderAccId}</div>
        </div>
        <br />
        <FormGroup>
          <ControlLabel>Recipient</ControlLabel>
          <FormControl
            input='text'
            placeholder='recipient'
            value={this.state.recipient}
            onChange={this.updateRecipient}
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