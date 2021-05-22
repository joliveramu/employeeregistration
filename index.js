const mysql = require('mysql');
const express = require('express');
let app = express();
const bodyparser = require('body-parser');
var path = require('path');

app.use(bodyparser.urlencoded({extended : true}));
app.use(bodyparser.json());

//declare connection variable to create mysql connection
let connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password: null,
    database: 'db_employee'
});

//Call connect function to connect to the database
connection.connect((error) =>{
    if(!error)
    console.log("Connection made.");
    else
    console.log("error: " + JSON.stringify(error,undefined,2));
});

//Design a Template Engine
app.set('view engine', 'ejs');

app.listen(3000, () => console.log("Listening @ port 3000"));

//Display Home page
app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/start.html'));
});

//Display Registration page
app.get('/Registration', function(request, response) {
	response.sendFile(path.join(__dirname + '/index.html'));
});


//Display AdminLogin page
app.get('/AdminLogin', function(request, response) {
	response.sendFile(path.join(__dirname + '/AdminLogin.html'));
});

//Display all employees
app.get("/Employees", (req, res)=>{
    connection.query("select * from employee;", (err, rows, fields)=>{
        if(!err)
        {
            res.render('List', { title: 'User List', userData: rows});
            res.end();
        }else{
            console.log(err);
            res.end();
        }
    })
});

//Approve Employee via ID
app.get("/Approval/:id", (req, res)=>{
    connection.query("UPDATE employee set approval = 'APPROVED' where employeeid = ?",[req.params.id], (err, rows, fields)=>{
        if(!err)
        {
            res.redirect("/Employees");
            res.end();
        }else{
            console.log(err);
            res.end();
        }
    })
});

//Submit Registration
app.post("/Submit", (request, response)=>{
    let query = "insert into employee (firstname, middlename, lastname, emailadd,contactnumber) values (?,?,?,?,?);";
    connection.query(query, [request.body.txtFirstName, request.body.txtMiddleName, request.body.txtLastName, request.body.txtEmail, request.body.txtContact],(err, rows, fields)=>{
        if(!err)
        {
            //res.send(rows);
            response.send("<h1>Employee has been entered.</h1><a href = '/'>Return to Registration</a>");
            response.end();
        }else{
            console.log(err);
            response.end();
        }
    })
});

//Login controller
app.post("/Login", (request, response)=>{
    if(request.body.txtAdmin === "Admin" && request.body.txtAdminPassword === "Password")
    {
        response.redirect('/Employees');
        response.end();
    }else{
        response.send("<h2 class = 'txt-danger'>Login failed</h2><a href ='/AdminLogin'>Try again</a>");

        response.end();
    }
});



