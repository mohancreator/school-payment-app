import React from 'react';
import './index.css';
import axios from 'axios';

const Navbar = () => {
  const handleExport = async () => {
    try {

      const response = await axios.get('https://school-payment-app.vercel.app/transactions?limit=10');
      const data = response.data.data;


      const csvData = convertToCSV(data);


      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'transactions.csv'); 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting data:', error.message || error);
    }
  };

  const convertToCSV = (data) => {
    const headers = Object.keys(data[0]).join(','); 
    const rows = data.map((item) => Object.values(item).join(',')); 
    return [headers, ...rows].join('\n'); 
  };

  return (
    <div className="navbar">
      <h1>History</h1>
      <button onClick={handleExport}>Export</button>
    </div>
  );
};

export default Navbar;
