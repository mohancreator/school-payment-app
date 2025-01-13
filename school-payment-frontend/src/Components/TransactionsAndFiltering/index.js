import React, { useEffect, useState } from 'react';  
import axios from 'axios';
import './index.css';
import { TailSpin } from 'react-loader-spinner';

const TransactionAndFiltering = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(10); 
  const [schoolId, setSchoolId] = useState(''); 
  const [customOrderId, setCustomOrderId] = useState(''); 
  const [manualStatus, setManualStatus] = useState(''); 
  const [transactionStatus, setTransactionStatus] = useState(null);

  console.log(transactions);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://school-payment-app.vercel.app/transactions?limit=${limit}`);
        if (response.data.data && response.data.data.length > 0) {
          setTransactions(response.data.data);
        } else {
          setTransactions([]);
        }
      } catch (err) {
        setError(err.message || 'Error fetching transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [limit]);

  const fetchTransactionsBySchool = async () => {
    if (!schoolId) {
      alert('Please provide a school ID');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`https://school-payment-app.vercel.app/transactions/school/${schoolId}`);
      if (response.data.data && response.data.data.length > 0) {
        setTransactions(response.data.data);
      } else {
        setTransactions([]);
      }
    } catch (err) {
      setError(err.message || 'Error fetching transactions by school');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactionStatus = async () => {
    if (!customOrderId) {
      alert('Please provide a custom order ID');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`https://school-payment-app.vercel.app/transactions/status/${customOrderId}`);
      if (response.data.data) {
        setTransactionStatus(response.data.data.status);
      } else {
        setTransactionStatus(null);
      }
    } catch (err) {
      setError(err.message || 'Error fetching transaction status');
    } finally {
      setLoading(false);
    }
  };

  const manualUpdateStatus = async () => {
    if (!customOrderId || !manualStatus) {
      alert('Please provide both custom order ID and status');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('https://school-payment-app.vercel.app/transactions/manual-update', {
        custom_order_id: customOrderId,
        status: manualStatus,
      });
      if (response.data.success) {
        alert('Transaction status updated successfully');
        setTransactionStatus(manualStatus);
      }
    } catch (err) {
      setError(err.message || 'Error updating transaction status');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (true) {
      case loading:
        return (
          <div className="rows-container">
            <TailSpin color="#4CAF50" height={50} width={50} />
            <p>Loading transactions...</p>
          </div>
        );
      case error:
        return (
          <div className="error-container">
            <p>Error: {error}</p>
          </div>
        );
      case transactions.length === 0:
        return (
          <div className="no-transactions-container">
            <p>No transactions available</p>
          </div>
        );
      default:
        return (
          <tbody>
            {transactions.map((transaction) => {
              const statusClass = transaction.status === 'PENDING'
                ? 'status-pending'
                : transaction.status === 'SUCCESS'
                ? 'status-success'
                : 'status-failed';

              return (
                <tr key={transaction._id}>
                  <td>{transaction._id}</td>
                  <td>{transaction.collect_id}</td>
                  <td className={statusClass}>{transaction.status}</td>
                  <td>{transaction.payment_method || 'N/A'}</td>
                  <td>{transaction.gateway}</td>
                  <td>{transaction.transaction_amount}</td>
                  <td>{transaction.bank_refrence || 'N/A'}</td>
                </tr>
              );
            })}
          </tbody>
        );
    }
  };

  return (
    <div className="transaction-container">
      <h1>Transaction Details</h1>

      {/* Input for filtering by school ID */}
      <div className="input-container">
        <label htmlFor="schoolId">School ID: </label>
        <input
          type="text"
          id="schoolId"
          value={schoolId}
          onChange={(e) => setSchoolId(e.target.value)}
        />
        <button onClick={fetchTransactionsBySchool}>Fetch Transactions by School</button>
      </div>

      {/* Input for custom order ID */}
      <div className="input-container">
        <label htmlFor="customOrderId">Custom Order ID: </label>
        <input
          type="text"
          id="customOrderId"
          value={customOrderId}
          onChange={(e) => setCustomOrderId(e.target.value)}
        />
        <button onClick={fetchTransactionStatus}>Check Transaction Status</button>
      </div>

      {/* Display the current status of the transaction */}
      {transactionStatus && (
        <div className="status-container">
          <p>Status: {transactionStatus}</p>
        </div>
      )}

      {/* Manual status update */}
      <div className="input-container">
        <label htmlFor="manualStatus">New Status: </label>
        <input
          type="text"
          id="manualStatus"
          value={manualStatus}
          onChange={(e) => setManualStatus(e.target.value)}
        />
        <button onClick={manualUpdateStatus}>Update Transaction Status</button>
      </div>

      {/* Set limit for transactions */}
      <div className="limit-container">
        <label htmlFor="limit">Set Limit: </label>
        <input
          type="number"
          id="limit"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          min="1"
        />
      </div>

      {/* Display transactions table */}
      <div>
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
          {renderContent()}
        </table>
      </div>
    </div>
  );
};

export default TransactionAndFiltering;
