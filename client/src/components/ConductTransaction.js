import React, { Component } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import history from '../history';


class ConductTransaction extends Component {
   state = { recipient: '', amount: 0,finInstNum: '',transNum: '', accountID:'',date: '', knownAddresses: [] };

  componentDidMount() {
      fetch(`${document.location.origin}/api/known-addresses`)
      .then(response => response.json())
      .then(json => this.setState({ knownAddresses: json }));
  }

  updateRecipient = event => {
    this.setState({ recipient: event.target.value });
  }

  updateAmount = event => {
    this.setState({ amount: Number(event.target.value) });
  }

  
  updateFinInstNum = event => {
    this.setState({ finInstNum: event.target.value });
  }
  updateTransNum = event => {
     this.setState({ transNum: event.target.value });
    }
  updateAccountId = event => {
      this.setState({ accountId: event.target.value });
    }
  updateDate = event => {
      this.setState({ date: event.target.value });
    }

 

  conductTransaction = () => {
    const { recipient, amount, finInstNum,accountId,transNum, date } = this.state;
     fetch(`${document.location.origin}/api/transact`, {

      method: 'POST',

      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify({ recipient, amount,finInstNum,accountId,transNum,date })

    }).then(response => response.json())

      .then(json => {

        alert(json.message || json.type);

        history.push('/transaction-pool');

      });

  }



  render() {

   
    return (

      <div className='ConductTransaction'>

        <Link to='/'>Home</Link>
        <h3>Conduct a Transaction</h3> 
        <br />
        {
           this.state.knownAddresses.map(knownAddress => {
             return (

              <div key={knownAddress}>
                <div>{knownAddress}</div>
                <br />
                </div>
                
                )
              })
        }
        <br />

        <FormGroup>
          <FormControl
              input='text'
              placeholder='recipient'
              value={this.state.recipient}
              onChange={this.updateRecipient}
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
            value={this.state.transNum}
            onChange={this.updateTransNum}
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
            input='date'
            placeholder='Date'
            value={this.state.date}
            onChange={this.updateDate}
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