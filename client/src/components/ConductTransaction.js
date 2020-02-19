import React, { Component } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import history from '../history';

class ConductTransaction extends Component {
  state = { chequeID: '', transNum: '', id = '', accountID: '', clientName: '',  knownAddresses: [] };

  componentDidMount() {
    fetch(`${document.location.origin}/api/known-addresses`)
      .then(response => response.json())
      .then(json => this.setState({ knownAddresses: json }));
  }

  updatechequeID = event => {
    this.setState({ chequeID: event.target.value });
  }

  updatetransNum = event => {
    this.setState({ transNum: event.target.value });
  }

  updateid = event => {
    this.setState({id: event.target.value });
  }

  updateaccountID = event => {
    this.setState({ accountID: event.target.value });
  }

  updateclientName = event => {
    this.setState({ clientName: event.target.value });
  }

  conductTransaction = () => {
    const {chequeID,transNum,id,accountID,clientName} = this.state;

    fetch(`${document.location.origin}/api/transact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({chequeID,transNum,id,accountID,clientName})
    }).then(response => response.json())
      .then(json => {
        alert(json.message || json.type);
        history.push('/transaction-pool');
      });
  }

  render() {
    console.log('this.state', this.state);
    return (
      <div className='ConductTransaction'>
        <Link to='/'>Home</Link>
        <h3>Conduct a Transaction</h3>
        <br />
        <h4>Cheque Information</h4>
        {
          this.state.knownAddresses.map(knownAddress => {
            return (
              <div key={knownAddress}>
                <div>{knownAddress}</div>
                <br />
              </div>
            );
          })
        }
        <br />
        <FormGroup>
          <FormControl
            input='text'
            placeholder='chequeID'
            value={this.state.chequeID}
            onChange={this.updatechequeID}
          />
        </FormGroup>
        <FormGroup>
          <FormControl
          input='text'
          placeholder='transNum'
          value={this.state.transNum}
          onChange={this.updatetransNum}
          />
        </FormGroup>
        <FormGroup>
          <FormControl
          input='text'
          placeholder='id'
          value={this.state.id}
          onChange={this.updateid}
          />
        </FormGroup>
        <FormGroup>
          <FormControl
          input='text'
          placeholder='accountID'
          value={this.state.accountID}
          onChange={this.updateaccountID}
          />
        </FormGroup>
        <FormGroup>
          <FormControl
          input='text'
          placeholder='clientName'
          value={this.state.clientName}
          onChange={this.updateclientName}
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