
var connection = require('../config/connection.js');

module.exports = function(app) {
//GET all indicator names, codes
//app.get ('api/indicators/')
  app.get('/api/indicators', (req, res) => {
    var q = "SELECT * FROM indicator";
    connection.query(q, (err, result) => {
      res.json(result);
    });
  });

//GET indicator_values for indicator_id
//app.get('api/indicators/:id')

  app.get('/api/indicator_dataXXX', (req, res) => {
    var q = "SELECT indicator.name, indicator.code,";
    q += "indicator_value.value ";
    q += "FROM indicator_value ";
    q += "INNER JOIN indicator"
    q += "ON indicator.id = indicator_value.indicator_id";
    connection.query(q, (err, result) => {
      res.json(result);
    });
  });

  app.get('/api/year_range', (req, res) => {
    var params = req.query; 
    console.log(params);    
    if (params.yearStart > params.yearEnd){
      console.error("Start year is less than end!");
    } else {
      var q = "select distinct i.id, i.name, i.code ";
      q += "from indicator i, indicator_value iv ";
      q += "where i.id = iv.indicator_id and iv.year > " + b.indicator_start;
      connection.query(q, (err, result) => {
        res.json(result);
      });
    }

  });
//app.post('api/indicators/new')
//app.post('api/ind_val/new')

};