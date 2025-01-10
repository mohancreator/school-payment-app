import React, { useEffect, useState } from 'react';
import './index.css';

const TransactionAndFiltering = () => {
  // Define the transaction data as state
  const [transactions, setTransactions] = useState([]);

  // Example transaction data (replace with API data if needed)
  const sampleTransactions = [
    {
      _id: '6730e74326c65c39b0ee022d',
      collect_id: '6730d9b926c65c39b0ee0154',
      status: 'PENDING',
      payment_method: 'NA',
      gateway: 'NA',
      transaction_amount: 10000,
      bank_reference: 'YESBNK232',
    },
    // Add more transactions here as needed
  ];

  // Populate transactions with sample data
  useEffect(() => {
    setTransactions(sampleTransactions);
  }, []);

  return (
    <div className="transaction-container">
      <h1>Transaction Details</h1>
      <table className="transaction-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Collect ID</th>
            <th>Status</th>
            <th>Payment Method</th>
            <th>Gateway</th>
            <th>Transaction Amount</th>
            <th>Bank Reference</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td>{transaction._id}</td>
              <td>{transaction.collect_id}</td>
              <td>{transaction.status}</td>
              <td>{transaction.payment_method}</td>
              <td>{transaction.gateway}</td>
              <td>{transaction.transaction_amount}</td>
              <td>{transaction.bank_reference}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionAndFiltering;
