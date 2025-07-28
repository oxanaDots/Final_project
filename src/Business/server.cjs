const express = require('express')
const app = express()
const PORT = 3000
const cors = require('cors');

app.use(cors());

const enterprises = require('./enterprises.json');
app.get('/api/enterprises', (req, res)=>{
    res.json(enterprises)
})

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

module.exports = app; 