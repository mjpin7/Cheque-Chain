import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import { FormGroup, FormControl, Button } from 'react-bootstrap';

class App extends Component {
  state = { walletInfo: {} };

  componentDidMount() {
    fetch('http://localhost:1234/api/wallet-info')
      .then(response => response.json())
      .then(json => this.setState({ walletInfo: json }));
  }

  updatebanker = event => {

    this.setState({ banker: event.target.value });

  }

  render() {
    const { address, balance } = this.state.walletInfo;

    return (
      <div className='App'>
        <img className='logo' src={logo}></img>
        <br />
        <div>
          Welcome to the ChequeClerance Network...
        </div>
        <br />
        
      
    
    
    <FormGroup>

    <FormControl

      input='text'

      placeholder='Banker-ID'

      value={this.state.banker}

      onChange={this.banker}
      />

      </FormGroup>
      <div>

      <Button

        bsStyle="danger"

        onClick={this.App}

      >

        Submit

      </Button>

    </div>
    <div><Link to='/blocks'>Blocks</Link></div>
        <div><Link to='/conduct-transaction'>Enter Cheque Info </Link></div>
        </div>
    );
        //<div><Link to='/transaction-pool'>Transaction Pool</Link></div>
        //<br />
        //<div className='WalletInfo'>
         // <div>Address: {address}</div>
          //<div>Balance: {balance}</div>
        //</div>
   }

  
}

export default App;