import React from 'react';

const Transaction = ({ transaction }) => {
  const { input, outputMap,finInstNum,accountId,transNum,date} = transaction;
  const recipients = Object.keys(outputMap);

  return (
    <div className='Transaction'>
      <div>From: {`${input.address.substring(0, 20)}...`} | Balance: {input.amount}</div>
      {
        recipients.map(recipient => (
          <div key={recipient}>
            To: {`${recipient.substring(0, 20)}...`} | Sent: {outputMap[recipient]}
          </div>
        ))
      }
      <div key = {finInstNum}> finInstNum: {updatefinInstNum}</div>
      <div key = {accountId}> accountId: {updateaccountId}</div>
      <div key = {transNum}> transNum: {updatetransNum}</div>
      <div key = {date}> date: {updatedate}</div>
      
      
    </div>
  );
}

export default Transaction;