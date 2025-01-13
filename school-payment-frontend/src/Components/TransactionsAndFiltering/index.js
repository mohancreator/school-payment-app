import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './index.css';

const TransactionAndFiltering = () => {
  const [transactions, setTransactions] = useState([]);
  
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('https://school-payment-app.vercel.app/transactions');
        setTransactions(response.data.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
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
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td>{transaction._id}</td>
                <td>{transaction.collect_id}</td>
                <td>{transaction.status}</td>
                <td>{transaction.payment_method}</td>
                <td>{transaction.gateway}</td>
                <td>{transaction.transaction_amount}</td>
                <td>{transaction.bank_reference}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No transactions available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionAndFiltering;
