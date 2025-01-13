const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();


app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

const uri = process.env.MONGODB_URI;

const transactionSchema = new mongoose.Schema({
  collect_id: String,
  school_id: String,
  gateway: String,
  order_amount: Number,
  transaction_amount: Number,
  status: String,
  custom_order_id: String,
});

const Transaction = mongoose.model('Transaction', transactionSchema);


mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB Connected Successfully');
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });


mongoose.connection.on('connected', async () => {
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log('Collections:', collections.map((col) => col.name));
});

mongoose.connection.once('open', () => {
  app.get('/transactions', async (req, res) => {
    try {
      const db = mongoose.connection.db;
      if (!db) {
        throw new Error('Database connection is not established');
      }
  
      const collectRequestStatus = db.collection('collect_request_status');
      
      // Get the limit query parameter or default to 10
      const limit = parseInt(req.query.limit, 10) || 10;
  
      // Fetch transactions with the specified limit
      const transactions = await collectRequestStatus.find({}).limit(limit).toArray();
  
      if (!transactions || transactions.length === 0) {
        return res.status(404).json({ success: false, message: 'No transactions found' });
      }
  
      res.status(200).json({ success: true, data: transactions });
    } catch (err) {
      console.error('Error fetching transactions:', err.message || err);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: err.message || err,
      });
    }
  });


  app.get('/transactions/school/:school_id', async (req, res) => {
    try {
      const { school_id } = req.params;
      const transactions = await Transaction.find({ school_id });
  
      if (!transactions || transactions.length === 0) {
        return res.status(404).json({ success: false, message: 'No transactions found for the specified school' });
      }
  
      res.status(200).json({ success: true, data: transactions });
    } catch (err) {
      console.error('Error fetching transactions by school:', err.message || err);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });
  
  app.get('/transactions/status/:custom_order_id', async (req, res) => {
    try {
      const { custom_order_id } = req.params;
      const transaction = await Transaction.findOne({ custom_order_id }, 'status');
  
      if (!transaction) {
        return res.status(404).json({ success: false, message: 'Transaction not found' });
      }
  
      res.status(200).json({ success: true, data: transaction });
    } catch (err) {
      console.error('Error checking transaction status:', err.message || err);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });
  
  app.post('/transactions/webhook', async (req, res) => {
    try {
      const { status, order_info } = req.body;
      const { order_id, gateway, order_amount, transaction_amount, bank_reference } = order_info;
  
      const updatedTransaction = await Transaction.findOneAndUpdate(
        { collect_id: order_id },
        { status, gateway, order_amount, transaction_amount, bank_reference },
        { new: true, upsert: true }
      );
  
      res.status(200).json({ success: true, message: 'Transaction updated successfully', data: updatedTransaction });
    } catch (err) {
      console.error('Error updating transaction via webhook:', err.message || err);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });
  
  app.post('/transactions/manual-update', async (req, res) => {
    try {
      const { custom_order_id, status } = req.body;
  
      const updatedTransaction = await Transaction.findOneAndUpdate(
        { custom_order_id },
        { status },
        { new: true }
      );
  
      if (!updatedTransaction) {
        return res.status(404).json({ success: false, message: 'Transaction not found' });
      }
  
      res.status(200).json({ success: true, message: 'Transaction status updated successfully', data: updatedTransaction });
    } catch (err) {
      console.error('Error manually updating transaction status:', err.message || err);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });
  

// Server initiation
const PORT = process.env.PORT || 3008;
app.listen(PORT, () => {
  console.log(`Server running successfully on http://localhost:${PORT}`);
});
})
