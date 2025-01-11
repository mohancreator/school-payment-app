const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const csv = require('csv-parser');

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.json());

// MongoDB URI from .env file
const uri = process.env.MONGODB_URI;

// Mongoose schema and model
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

// Endpoint to import CSV file
app.post('/import-csv', async (req, res) => {
  try {
    const filePath = '../test.collect_request_status.csv'; // Replace with your CSV file path
    const transactions = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        transactions.push(row);
      })
      .on('end', async () => {
        try {
          await Transaction.insertMany(transactions);
          res.status(200).json({ success: true, message: 'CSV data imported successfully!' });
        } catch (err) {
          console.error('Error inserting data into MongoDB:', err);
          res.status(500).json({ success: false, message: 'Error importing data into MongoDB' });
        }
      })
      .on('error', (err) => {
        console.error('Error reading CSV file:', err);
        res.status(500).json({ success: false, message: 'Error reading CSV file' });
      });
  } catch (err) {
    console.error('Error importing CSV data:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Other endpoints
app.get('/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find({});
    res.status(200).json({ success: true, data: transactions });
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.get('/transactions/school/:school_id', async (req, res) => {
  try {
    const { school_id } = req.params;
    const transactions = await Transaction.find({ school_id });
    res.status(200).json({ success: true, data: transactions });
  } catch (err) {
    console.error('Error fetching transactions by school:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.get('/transactions/status/:custom_order_id', async (req, res) => {
  try {
    const { custom_order_id } = req.params;
    const transaction = await Transaction.findOne({ custom_order_id });
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }
    res.status(200).json({ success: true, data: transaction });
  } catch (err) {
    console.error('Error checking transaction status:', err);
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
    console.error('Error updating transaction via webhook:', err);
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
    console.error('Error manually updating transaction status:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Start the server
const PORT = process.env.PORT || 3008;
app.listen(PORT, () => {
  console.log(`Server running successfully on http://localhost:${PORT}`);
});
