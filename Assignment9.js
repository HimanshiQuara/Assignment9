const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(bodyParser.json());

// Connect to the database
const sequelize = new Sequelize('api', 'root', 'Himanshi@123', {
  host: 'localhost',
  dialect: 'mysql'
});

// Define the model for the api table
const Api = sequelize.define('Api', {
  name: DataTypes.STRING,
  age: DataTypes.INTEGER,
  gender: DataTypes.STRING,
  rollNumber: DataTypes.INTEGER
});

// Sync the model with the database
sequelize.sync()
  .then(() => {
    console.log('Database & tables created!');
  });

// Create a new record in the database
app.post('/api', (req, res) => {
  const { name, age, gender, rollNumber } = req.body;
  Api.create({ name, age, gender, rollNumber })
    .then(() => {
      res.status(201).send('Record created successfully');
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Error creating record');
    });
});

// Update an existing record in the database
app.put('/api/:rollNumber', (req, res) => {
  const { name } = req.body;
  const { rollNumber } = req.params;
  Api.update({ name }, { where: { rollNumber } })
    .then(() => {
      res.status(200).send('Record updated successfully');
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Error updating record');
    });
});

// Get all records from the database
app.get('/api', (req, res) => {
  Api.findAll()
    .then(records => {
      res.status(200).json(records);
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Error getting records');
    });
});

// Get a specific record from the database by roll number
app.get('/api/:rollNumber', (req, res) => {
  const { rollNumber } = req.params;
  Api.findOne({ where: { rollNumber } })
    .then(record => {
      if (!record) {
        res.status(404).send('Record not found');
      } else {
        res.status(200).json(record);
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Error getting record');
    });
});

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

module.exports = app;
