const express = require('express');
const mongoose = require('mongoose'); 
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const MONGO_URI = 'mongodb://127.0.0.1:27017/apexdev';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(' MongoDB Database Successfully Connected');
  })
  .catch((err) => {
    console.log(' MongoDB Connection Error:', err);
  });

app.get('/', (req, res) => {
  res.send('ApexDev IS LIVE');
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server live on port ${PORT}`);
});