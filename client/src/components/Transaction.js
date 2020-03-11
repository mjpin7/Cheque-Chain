import React, { Component } from 'react';
import { getBsProps } from 'react-bootstrap/lib/utils/bootstrapUtils';
import ConductTransaction from './ConductTransaction';

const Transaction = ({ transaction }) => {
  const { input, outputMap,datamap,accountId,transNum,date} = transaction;
  const recipients = Object.keys(outputMap);
  
 
  return (
    <div className='Transaction'>
      <div>From: {`${input.address.substring(0, 20)}...`} | Balance: {input.amount}</div>
      <div>finInstNum: {`${datamap.finInstNum}`}</div>
      {
        recipients.map(recipient => (
          <div key={recipient}>
            To: {`${recipient.substring(0, 20)}...`} | Sent: {outputMap[recipient]}
           
          </div>
        ))
      }
     
      
    
    </div>
    
  );
  // <div key = {finInstNum}> finInstNum: {updatefinInstNum}</div>
  //     <div key = {accountId}> accountId: {updateaccountId}</div>
  //     <div key = {transNum}> transNum: {updatetransNum}</div>
  //     <div key = {date}> date: {updatedate}</div>
      
}

export default Transaction;