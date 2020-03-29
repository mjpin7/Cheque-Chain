import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import logo from '../assets/logo.png';
import Cookies from 'universal-cookie'; 
import history from '../history';  

const cookies = new Cookies();

class App extends Component {
  state = { walletInfo: {}, name: "", accountId: "", finInstNum: "" };
  componentDidMount() {
    fetch(`${document.location.origin}/api/wallet-info`)
      .then(response => response.json())
      .then(json => this.setState({ walletInfo: json }));

    this.setState({name: cookies.get('name'), accountId: cookies.get('accountId'), finInstNum: cookies.get('finInstNum')});
  }

  // Function to get rid of cookies that have been set and redirect user to login page (logout)
  logout = () => {
    cookies.remove('name');
    cookies.remove('accountId');
    cookies.remove('finInstNum');
    history.push('/');
  }

  render() {    
    const { address, balance } = this.state.walletInfo;

    return (
      <div className='App'>
        {/* <img className='logo' src={logo}></img> */}
        <br />
        <div>
          Welcome to Cheque Chain!
        </div>
        <br />
        <div><Link to='/blocks'>Blocks</Link></div>
        <div><Link to='/conduct-transaction'>Conduct a Transaction</Link></div>
        <div><Link to='/transaction-pool'>Transaction Pool</Link></div>
        <div>
          <Button
            bsStyle="danger"
            onClick={this.logout}
          >Logout</Button>
        </div>
        <br /><br/><br/>
        <div className='Info'>
          <div>Name: {this.state.name}</div>
          <div>Account ID: {this.state.accountId}</div>
          <div>Financial Institution Number: {this.state.finInstNum}</div>
        </div>
      </div>
    );
  }
}




export default App;
