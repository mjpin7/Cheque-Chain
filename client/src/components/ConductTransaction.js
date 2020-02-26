import React, { Component } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import history from '../history';

class ConductTransaction extends Component {
  state = { finInstNum: '', tranNum: '', accountId: '' , amount: 0};

  componentDidMount() {
    // fetch(`${document.location.origin}/api/known-addresses`)
    //   .then(response => response.json())
    //   .then(json => this.setState({ knownAddresses: json }));
  }

  updateFinInstNum = event => {
    this.setState({ finInstNum: event.target.value });
  }

  updateTranNum = event => {
    this.setState({ tranNum: event.target.value });
  }

  updateAccountId = event => {
    this.setState({ accountId: event.target.value });
  }

  updateAmount = event => {
    this.setState({ amount: Number(event.target.value) });
  }

  conductTransaction = () => {
    const { finInstNum, tranNum, accountId, amount } = this.state;

    fetch('http://3.12.159.16:3000', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ amount, finInstNum, tranNum, accountId })
    }).then(response => response.json())
      .then(resp => {
        if (resp.amountvalid == true && resp.accountvalid == true) {
          alert("Transaction cleared")
        }
        else {
          if(resp.accountvalid == false) {
            alert("Account not valid");
          }
          else if(resp.amountvalid == false) {
            alert("Non sufficient funds");
          }
        }
        // history.push('/transaction-pool');
      }).catch((error) => {
        console.log(error)
      });
  }

  render() {
    return (
      <div className='ConductTransaction'>
        <Link to='/'>Home</Link>
        <h3>Conduct a Transaction</h3>
        <br />
        <FormGroup>
          <FormControl
            input='text'
            placeholder='financial institution number'
            value={this.state.finInstNum}
            onChange={this.updateFinInstNum}
          />
        </FormGroup>
        <FormGroup>
          <FormControl
            input='text'
            placeholder='transit number'
            value={this.state.tranNum}
            onChange={this.updateTranNum}
          />
        </FormGroup>
        <FormGroup>
          <FormControl
            input='text'
            placeholder='account id'
            value={this.state.accountId}
            onChange={this.updateAccountId}
          />
        </FormGroup>
        <FormGroup>
          <FormControl
            input='number'
            placeholder='amount'
            value={this.state.amount}
            onChange={this.updateAmount}
          />
        </FormGroup>
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