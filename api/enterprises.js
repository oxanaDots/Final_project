// const express = require('express')
// const app = express()
// const PORT = 3001
// const cors = require('cors');
// app.use(cors());

// const enterprises = require('./enterprises.json');
// app.get('/api/enterprises', (req, res)=>{
//     res.json(enterprises)
// })


// app.listen(PORT, () => console.log(`Server ready on port ${PORT}.`));

// module.exports = app; 

import enterprises from './enterprises.json';

export default function handler(req, res) {
  res.status(200).json(enterprises);
}