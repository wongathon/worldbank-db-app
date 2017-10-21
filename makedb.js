#!/usr/bin/env node

'use strict';

const parse      = require('csv-parse');
const util       = require('util');
const fs         = require('fs');
const path       = require('path');
const mysql      = require('mysql');
const async      = require('async');
const csvHeaders = require('csv-headers');


const dbhost = "localhost";
const dbuser = "root";
const dbpass = "";
const dbname = "worldbank_db_test";
const tbl1  = "indicator";
const tbl2  = "indicator_value";

const csvfn  = "./wbchn.csv";

new Promise((resolve, reject) => {
    csvHeaders({
        file      : "./wbchn.csv",
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
                console.log('connection');
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

        console.log("creating tables...");

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
            async.eachOfSeries(data, (datum, i, next) => {
                
                //console.log(data); //Objects with header: cell data
                console.log(datum);

                var d = [];
                try {
                    context.headers.forEach(hdr => {
                        d.push(datum[hdr]);
                    });
                } catch (e) {
                    console.error(e.stack);
                }

                console.log(context.headers);

                var nameCode = d.slice(0, 2);
                context.db.query(`INSERT INTO ${tbl1} ( name, code ) VALUES ( ?, ? )`, nameCode, 
                    err => {
                        if (err) { console.error(err); next(err); }
                        else setTimeout(() => { });
                    });

                // var yearVal = [];
                // yearVal.push(i+1);

                // try {
                //     context.headers.forEach(hdr => {

                //     });
                // } catch (e) {
                //     console.error(e.stack);
                // }


                // context.db.query(`INSERT INTO ${tbl2} ( indicator_id, year, value ) VALUES ( ?, ?, ? )`, yearVal, 
                //     err => {
                //         if (err) { console.error(err); next(err); }
                //         else setTimeout(() => { next(); });
                //     });


                // //arrays to store columns with data
                // var unaltArr = context.field_names.split(', ');
                // var altArr = [];
                // var datArr = [];
                // var qs2 = '';

                // d.forEach( (datum, i) => {
                //     //if item is blank
                //     if (datum !== '') {
                //         datArr.push(datum);
                //         altArr.push(unaltArr[i]); 
                //         if (qs2 !== '') qs2 += ',';
                //         qs2 += ' ?';
                //     }
                // });
                // var field_names2 = altArr.join(', ');

                // console.log(`${datArr.length} items in D`);



            },
            err => {
                if (err) reject(err);
                else resolve(context);
            });
        }));
    });
})
.then(context => { context.db.end(); })
.catch(err => {console.error(err.stack); });




