import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Transaction from './Transaction';

class Block extends Component {
  state = { displayData: false };

  toggleData = () => {
    this.setState({ displayData: !this.state.displayData });
  }

  get displayData() {
    const { data } = this.props.block;

    const stringifiedData = JSON.stringify(data);

    const dataDisplay = stringifiedData.length > 35 ?
      `${stringifiedData.substring(0, 35)}...` :
      stringifiedData;

    if (this.state.displayData) {
      var dataKey = Object.keys(data);
      return (
        <div>
          <div>Data: </div>
          {
            Object.keys(data).map(key => (
              <div>{key}: {JSON.stringify(data[key])}</div>
            ))
          }
          <br />
          <Button
            bsStyle="danger"
            bsSize="small"
            onClick={this.toggleData}
          >
            Show Less
          </Button>
        </div>
      )
    }

    return (
      <div>
        <div>Data: {dataDisplay}</div>
        <Button
          bsStyle="danger"
          bsSize="small"
          onClick={this.toggleData}
        >
          Show More
        </Button>
      </div>
    );
  }

  render() {
    const { timestamp, hash } = this.props.block;

    const hashDisplay = `${hash.substring(0, 15)}...`;

    return (
      <div className='Block'>
        <div>Hash: {hashDisplay}</div>
        <div>Timestamp: {new Date(timestamp).toLocaleString()}</div>
        {this.displayData}
      </div>
    );
  }
};

export default Block;