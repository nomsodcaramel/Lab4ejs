var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');
var port = 5033;
 
router.get('/', function (request, response) {
    response.sendFile(path.join(__dirname+
        '/../frontend/home.html'))
})
 
router.get('/aboutus', function (request, response) {
    response.sendFile(path.join(__dirname+
        '/../frontend/contact.html'))
})
 
var ejs = require('ejs');
var fs = require('fs');
const { json } = require('body-parser');
var rawdata = fs.readFileSync('branch.json');
var branch = JSON.parse(rawdata);
 
router.get('/showBranch', function (request, response) {
    response.render(path.join(__dirname+
        '/../frontend/OurBranch.ejs'),
        {   motto: "Shopping at Shoppo",
            ishev: "Love chicken",
            br1: branch.branch1,
            br2: branch.branch2,
            br3: branch.branch3,
            br4: branch.branch4,
            br5: branch.branch5,
            br6: branch.branch6,
            br7: branch.branch7
           
        })
})
 
var mysql = require('mysql');
var dotenv = require('dotenv');
dotenv.config();
var connection = mysql.createConnection({
  host: process.env.DB_HOSTSERVER,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT
});
router.get('/showCustomer', function (request, response) {
  cid = request.query.customerID;
  sql = "select id, name, city, zip, gender"
        + " from customer_tracking "
        + " where id ="+cid
  var customerInfo = { cid:0, cname:"", ccity:"", czip:"",czip:"", cgender:""};
  connection.query(sql, function (error, result) {
     if(error) { throw error;}
     else{ customerInfo.cid   = result[0].id;
           customerInfo.cname = result[0].name;
           customerInfo.ccity = result[0].city;
           customerInfo.czip  = result[0].zip;
           customerInfo.cgender = request[0].gender;
           response.render(path.join(__dirname
            + '/../frontend/customer.ejs'),
              {cInfo: customerInfo}
            );
     }
  })
})
 router.get('/showProducts', function (request, response) {
    cate = request.query.productGroup;
    sql = "select id, name, price, category"+" from products " +" where category = '"+cate+"'";
    var productInfo= {pid:0, pname:"", pprice:0, pcategory:""};

    connection.query(sql, function (error, result) {
        if(error) throw error;
        else{
            response.render(path.join(__dirname
                + '/../frontend/listProduct.ejs'),
                { productData: result, productCategory: cate});
        }
    })

}) 
app.use('/', router);
var server = app.listen(port, '10.4.53.25', function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Shoppo.com is deployed at "+host+":"+port)
})