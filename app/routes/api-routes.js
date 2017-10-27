
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

  app.get('/api/indicators/ids', (req, res) => {
    var params = req.query;
    var q = "select * from indicator where indicator.id in (" +params.missingIds+ ")";
    connection.query(q, (err, result) => {
      res.json(result);
    });
  });

  //GET for ALL. Too slow to use. 
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

      var q = "select distinct i.id, i.name, i.code, iv.year, iv.value ";
      q += "from indicator i, indicator_value iv ";
      q += "where i.id IN (" +params.selectedIds+ ") and iv.indicator_id = i.id and iv.year >= " + params.yearStart + " and iv.year <= " + params.yearEnd;
      console.log("about to call "+ q);
      connection.query(q, (err, result) => {
        if (err) console.log(err);
        res.json(result);
      });
    }

  });


//GET indicator_values for indicator_id
//app.get('api/indicators/:id')
//app.post('api/indicators/new')
//app.post('api/ind_val/new')

};