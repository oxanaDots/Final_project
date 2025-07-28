const express = require('express')
const app = express()
const PORT = 3000
const cors = require('cors');

app.use(cors());

const enterprises = require('../src/Business/enterprises.json');
app.get('/api/enterprises', (req, res)=>{
    res.json(enterprises)
})



module.exports = app; 