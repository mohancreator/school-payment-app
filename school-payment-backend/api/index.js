const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(bodyParser.json());

// MongoDB connection URI
const uri = process.env.MONGODB_URI;

// MongoDB Schema and Model
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

// Connect to MongoDB
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB Connected Successfully');
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });

// List all collections when connected to MongoDB
mongoose.connection.on('connected', async () => {
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log('Collections:', collections.map((col) => col.name));
});

// API Endpoints

// i) Fetch All Transactions
app.get('/transactions', async (req, res) => {
  try {
    const db = mongoose.connection.db
    const collectRequestStatus = db.collection('collect_request_status')
    const transactions = await collectRequestStatus.find({}, {
      collect_id: 1,
      school_id: 1,
      gateway: 1,
      order_amount: 1,
      transaction_amount: 1,
      status: 1,
      custom_order_id: 1,
    }).toArray();

    res.status(200).json({ success: true, data: transactions });
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// ii) Fetch Transactions by School
app.get('/transactions/school/:school_id', async (req, res) => {
  try {
    const school_id = req.params.school_id;
    const db = mongoose.connection.db
    const collectRequest = db.collection('collect_request')
    const transactions = await collectRequest.find({ school_id:school_id }).toArray();
    res.status(200).json({ success: true, data: transactions });
  } catch (err) {
    console.error('Error fetching transactions by school:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// iii) Transaction Status Check
app.get('/transactions/status/:custom_order_id', async (req, res) => {
  try {
    const { custom_order_id } = req.params;
    const db = mongoose.connection.db
    const collectRequest = db.collection('collect_request')
    const transaction = await collectRequest.findOne({ custom_order_id }, { status: 1 });
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }
    res.status(200).json({ success: true, data: transaction });
  } catch (err) {
    console.error('Error checking transaction status:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// iv) Webhook for Status Updates
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
    console.error('Error updating transaction via webhook:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// v) Manual Status Update
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
    console.error('Error manually updating transaction status:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Server initiation
const PORT = process.env.PORT || 3008;
app.listen(PORT, () => {
  console.log(`Server running successfully on http://localhost:${PORT}`);
});
