#!/usr/bin/env node

'use strict';

const parse      = require('csv-parse');
const fs         = require('fs');
const path       = require('path');
const mysql      = require('mysql');
const async      = require('async');
const csvHeaders = require('csv-headers');


//change to process.argvs
const dbhost = "localhost";
const dbuser = "root";
const dbpass = "";
const dbname = "worldbank_db_test";
const tbl1  = "indicator";
const tbl2  = "indicator_value";
const csvfn  = "./wbchn.csv";

new Promise((resolve, reject) => {
    csvHeaders({
        file      : csfvn,
        delimiter : ','
    }, function(err, headers) {
        if (err) reject(err);
        else resolve({ headers });
    });
})
.then(context => {
    return new Promise((resolve, reject) => {
        context.db = mysql.createConnection({
            host: dbhost,
            user: dbuser,
            password: dbpass,
            database: dbname
        });

        context.db.connect((err) => {
            if (err) {
                console.error('error connecting: '+ err.stack);
                reject(err);
            } else {
                console.log('Connection to db.');
                resolve(context);
            }
        });
    })
})
.then(context => {
    return new Promise((resolve, reject) => {
        context.db.query(`DROP TABLE IF EXISTS ${tbl1}`, 
            [],
            err => {
                if (err);
            });
        context.db.query(`DROP TABLE IF EXISTS ${tbl2}`, 
            [],
            err => {
                if (err);
                else resolve(context);
            });
    });
})
.then(context => {
    return new Promise((resolve, reject) => {
        var fields1 = '';
        var fields2 = '';

        fields1 += `id int not null auto_increment, `;
        fields1 += `name varchar(150) not null, `;
        fields1 += `code varchar(35) not null, `;
        fields1 += `primary key (id)`;

        fields2 += `indicator_id int not null, `;
        fields2 += `year int not null, `;
        fields2 += `value real, `;
        fields2 += `primary key (indicator_id, year)`;

        console.log("Creating tables...");

        context.db.query(`CREATE TABLE IF NOT EXISTS ${tbl1} ( ${fields1} )`,
            [],
            err => {
                if (err) reject(err);
            });
        context.db.query(`CREATE TABLE IF NOT EXISTS ${tbl2} ( ${fields2} )`,
            [],
            err => {
                if (err) reject(err);
                else resolve(context);
            });
    });
})
.then(context => {
    return new Promise((resolve, reject) => {
        fs.createReadStream(csvfn).pipe(parse({
            delimiter: ',',
            columns: true,
            relax_column_count: true
        }, (err, data) => {
            if (err) return reject(err);
            console.log("Populating tables...")
            context.dataValues = 0;
            async.eachOfSeries(data, (datum, dataIndex, next) => {
                //console.log(datum);
                // BEGIN Transation.  If the transaction fails, able to rollback any modifications within the transaction
                context.db.beginTransaction((err) => {
                var nameCode = []; 
                nameCode.push(datum["Indicator Name"]);
                nameCode.push(datum["Indicator Code"]);

                context.db.query(`INSERT INTO ${tbl1} (name, code) VALUES (?,?)`, nameCode, (err, result) => {
                      // rollback on error.  Maybe log the error and keep the row number that failed for reporting later
                    context.dataIndex = dataIndex;

                    if (err) {
                        console.error(err);
                        context.db.rollback((err) => {
                                console.error(err);
                                next(err);
                            });
                    } else {
                      // use result.insertId to insert each year
                        for (var prop in datum) {
                            if (datum[prop] !== '' && (prop.substring(0,2) === '19' || prop.substring(0,2) === '20')) {
                            var yearData = [];
                            yearData.push(result.insertId);
                            yearData.push(prop);
                            yearData.push(datum[prop]);
                            context.dataValues += 1;

                            context.db.query(`INSERT INTO ${tbl2} ( indicator_id, year, value ) VALUES ( ?, ?, ? )`, yearData, 
                                                err => { if (err) { 
                                                    console.error(err); context.db.rollback((err) => {throw err;}); 
                                                    throw err;}
                                                });  
                            }
                        }
                       // no errors by this row...commit the transaction
                        context.db.commit((err) => {
                            if (err) {
                                console.error(err);
                                context.db.rollback((err) => {
                                    console.error(err);
                                    next(err);
                                });
                            } else setTimeout(() => { next(); });
                        });
                    }
                })
                
                });//END Transaction
            },
            err => {
                if (err) reject(err);
                else resolve(context);
            });
        }));
    });
})
.then(context => { 
    context.db.end(); 
    console.log(`Added ${(context.dataIndex+1).toLocaleString()} indicators and associated codes.`);
    console.log(`Entered ${context.dataValues.toLocaleString()} data points.`);
})
.catch(err => {console.error(err.stack); });




