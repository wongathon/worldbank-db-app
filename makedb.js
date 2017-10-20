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
const tbl1  = "table_1";
const tbl2  = "table_2";

//const csvfn  = process.argv[7];

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
                else resolve(context);
            })
    });
})
.then(context => {
    return new Promise((resolve, reject) => {
        var fields = '';
        var field_names = '';
        var qs = '';
        context.headers.forEach(hdr => {

            hdr = hdr.replace(' ', '_');
            if (hdr.length === 4 && hdr.substring(0,2) === '19' || hdr.substring(0,2) === '20') hdr = 'y_' + hdr;

            if (fields !== '') fields += ',';
            if (field_names !== '') field_names += ',';
            if (qs !== '') qs += ',';


            if (hdr === 'Indicator_Name') fields += ` ${hdr} varchar(150) not null`;
            if (hdr === 'Indicator_Code') fields += ` ${hdr} varchar(35) not null`;
            if (hdr.substring(0,2) === 'y_') fields += ` ${hdr} real`;
            
            field_names += ` ${hdr}`;
            qs += ' ?';
        });
        context.qs = qs;
        context.field_names = field_names;
        console.log(`about to create CREATE TABLE IF NOT EXISTS ${tbl1} ( ${fields} )`);
        context.db.query(`CREATE TABLE IF NOT EXISTS ${tbl1} ( ${fields} )`,
            [],
            err => {
                if (err) reject(err);
                else resolve(context);
            })
    });
})