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

import enterprises from './enterprises.json'  assert { type: 'json' };;

export default (req, res) => {
  // you can even log here to see it in Vercel logs:
  console.log('Serving enterprises, count =', length);
  res.status(200).json(enterprises);
};