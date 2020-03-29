const uuid = require('uuid/v1');
const { verifySignature } = require('../util');
const { REWARD_INPUT, MINING_REWARD } = require('../config');

class Transaction {
  constructor({ senderWallet, recipient, amount, outputMap, input, finInstNum, accountId, tranNum, date, datamap, recFinInstNum, postDate }) {
    this.id = uuid();
    this.outputMap = outputMap || this.createOutputMap({ senderWallet, recipient: recFinInstNum, amount: postDate ? 0 : amount });
    this.datamap = datamap || this.createDataMap({ finInstNum, accountId, tranNum, date, recipient, recFinInstNum, amount, postDate })
    this.input = input || this.createInput({ senderWallet, outputMap: this.outputMap });
  }

  createDataMap({ finInstNum, accountId, tranNum, date, recipient, amount, postDate }) {
    const datamap = [];

    const entry = {
      'fromFinInstNum': finInstNum, 
      'fromAccountId': accountId, 
      'fromTranNum': tranNum,
      'toAccountId': recipient,
      'amount': amount,
      'date': date,
      'postDate': postDate
    };
    datamap.push(entry);

    return datamap;
  }

  createOutputMap({ senderWallet, recipient, amount }) {
    const outputMap = {};

    outputMap[recipient] = amount;
    outputMap[senderWallet.publicKey] = senderWallet.balance - amount;

    return outputMap;
  }

  createInput({ senderWallet, outputMap }) {
    return {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(outputMap)
    };
  }

  update({ senderWallet, recipient, amount, finInstNum, accountId, tranNum, date, recFinInstNum, postDate }) {
    if (amount > this.outputMap[senderWallet.publicKey]) {
      throw new Error('Amount exceeds balance');
    }

    const newAmount = (postDate ? 0 : amount);

    if (!this.outputMap[recFinInstNum]) {
      this.outputMap[recFinInstNum] = newAmount;
    } else {
      this.outputMap[recFinInstNum] = this.outputMap[recFinInstNum] + newAmount;
    }

    this.outputMap[senderWallet.publicKey] =
      this.outputMap[senderWallet.publicKey] - newAmount;

    this.input = this.createInput({ senderWallet, outputMap: this.outputMap });

    const entry = {
      'fromFinInstNum': finInstNum, 
      'fromAccountId': accountId, 
      'fromTranNum': tranNum,
      'toAccountId': recipient,
      'amount': amount,
      'date': date,
      'postDate': postDate
    }

    this.datamap.push(entry);

    // this.datamap = this.createDataMap({ finInstNum, accountId, tranNum, date }); push onto the datamap list here
  }

  static validTransaction(transaction) {
    const { input: { address, amount, signature }, outputMap } = transaction;

    const outputTotal = Object.values(outputMap)
      .reduce((total, outputAmount) => total + outputAmount);

    if (amount !== outputTotal) {
      console.error(`Invalid transaction from ${address}`);
      return false;
    }

    if (!verifySignature({ publicKey: address, data: outputMap, signature })) {
      console.error(`Invalid signature from ${address}`);
      return false;
    }

    return true;
  }

  // static rewardTransaction({ minerWallet }) {
  //   return new this({
  //     input: REWARD_INPUT,
  //     outputMap: { [minerWallet.publicKey]: MINING_REWARD }
  //   });
  // }
}

module.exports = Transaction;