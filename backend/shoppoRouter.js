const express = require('express');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');
const branch = require('./branch.json');
const mysql = require('mysql');
const dotenv = require('dotenv');

const app = express();
const router = express.Router();
const port = 5025;

router.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, '/../frontend/home.html'));
});

router.get('/aboutus', (request, response) => {
    response.sendFile(path.join(__dirname, '/../frontend/contact.html'));
});


router.get('/showBranch', (request, response) => {
    response.render(path.join(__dirname, '/../frontend/OurBranch.ejs'), {
        motto: "Shopping at Shoppo",
        ishev: "Love chicken",
        ...branch
    });
});

dotenv.config();
const connection = mysql.createConnection({
    host: process.env.DB_HOSTSERVER,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
});

router.get('/showCustomer', (request, response) => {
    const cid = request.query.customerID;
    const sql = `SELECT id, name, city, zip, gender FROM customer_tracking WHERE id = ${cid}`;
    const customerInfo = { cid: 0, cname: "", ccity: "", czip: "", cgender: "" };

    connection.query(sql, (error, result) => {
        if (error) {
            throw error;
        } else {
            const customer = result[0];
            customerInfo.cid = customer.id;
            customerInfo.cname = customer.name;
            customerInfo.ccity = customer.city;
            customerInfo.czip = customer.zip;
            customerInfo.cgender = customer.gender;
            response.render(path.join(__dirname, '/../frontend/customer.ejs'), {
                cInfo: customerInfo
            });
        }
    });
});

router.get('/showProducts', (request, response) => {
    const cate = request.query.productGroup;
    const sql = `SELECT id, name, price, category FROM products WHERE category = '${cate}'`;
    const productInfo = { pid: 0, pname: "", pprice: 0, pcategory: "" };

    connection.query(sql, (error, result) => {
        if (error) {
            throw error;
        } else {
            response.render(path.join(__dirname, '/../frontend/listProduct.ejs'), {
                productData: result,
                productCategory: cate
            });
        }
    });
});

app.use('/', router);
const server = app.listen(port, '10.4.53.25', () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log("Shoppo.com is deployed at " + host + ":" + port);
});
