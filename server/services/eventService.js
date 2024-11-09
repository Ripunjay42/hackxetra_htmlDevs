const db = require('../db/connection');

exports.selectAll = (req, res) => {
    db.any('SELECT * FROM events')  // Assuming 'User' is the table name
      .then((data) => {
        console.log(data);
        return res.json({ events: data }); // Return the fetched events or users
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json({ error: 'Failed to fetch data', details: error }); // Better error response
      });
  };
exports.createEvent = (req,res)=>{
    return "hello";
}