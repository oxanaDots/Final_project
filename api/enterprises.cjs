const express = require('express')
const app = express()
const PORT = 3001
const cors = require('cors');

app.use(cors());

const enterprises = require('./enterprises.json');
app.get('/api/enterprises', (req, res)=>{
    res.json(enterprises)
})


app.listen(PORT, () => console.log(`Server ready on port ${PORT}.`));

module.exports = app; // api/enterprises.js
// import data from './enterprises.json';

// export function GET() {
//   return new Response(JSON.stringify(data), {
//     headers: { 'Content-Type': 'application/json' }
//   });
// }
