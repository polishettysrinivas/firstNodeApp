const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparsar = require('body-parser');

app.use(bodyparsar.json());

var mysqlconnection = mysql.createConnection({
  host: 'localhost',
  user: 'phpmyadmin',
  password: 'Mydatabase@123',
  database: 'employeedb',
  multipleStatements: true
});

mysqlconnection.connect((err) => {
  if (!err) {
    console.log('CONNECTION CREATED');
  }
  else {
    console.log('ERROR');
  }
});

app.listen(3000, () => console.log('Express Server is Running at port no: 3000'));

//GET ALL EMPLOYEES
app.get('/employees', (req, res) => {
  mysqlconnection.query('SELECT * FROM employee', (err, rows, fields) => {
    if (!err) {
      res.send(rows);
    }
    else {
      console.log(err);
    }
  });
});


//GET SELECTED EMPLOYEE
app.get('/employees/:id', (req, res) => {
  mysqlconnection.query('SELECT * FROM employee WHERE EmpID=?', [req.params.id], (err, rows, fields) => {
    if (!err) {
      res.send(rows);
    }
    else {
      console.log(err);
    }
  });
});


//DELETE AN EMPLOYEE
app.delete('/employees/:id', (req, res) => {
  mysqlconnection.query('DELETE FROM employee WHERE EmpID=?', [req.params.id], (err, rows, fields) => {
    if (!err) {
      res.send('Deleted Successfully');
    }
    else {
      console.log(err);
    }
  });
});

//INSERT AN EMPLOYEE
app.post('/employees', (req, res) => {
  let emp = req.body;
  var sql = "SET @EmpID = ?;SET @Name = ?;SET @EmpCode = ?;SET @Salary = ?; \
    CALL EmployeeAddOrEdit(@EmpID,@Name,@EmpCode,@Salary);";
  mysqlconnection.query(sql, [emp.EmpID, emp.Name, emp.EmpCode, emp.Salary], (err, rows, fields) => {
    if (!err) {
      rows.forEach(element => {
        if (element.constructor === Array) {
          res.send('Insterted a New Employee with ID: ' + element[0].EmpID);
        }
      });
    }
    else {
      console.log(err);
    }
  });
});


//UPDATE AN EMPLOYEE
app.put('/employees', (req, res) => {
  let emp = req.body;
  var sql = "SET @EmpID = ?;SET @Name = ?;SET @EmpCode = ?;SET @Salary = ?; \
    CALL EmployeeAddOrEdit(@EmpID,@Name,@EmpCode,@Salary);";
  mysqlconnection.query(sql, [emp.EmpID, emp.Name, emp.EmpCode, emp.Salary], (err, rows, fields) => {
    if (!err) {
      res.send('Updated Successfully');
    }
    else {
      console.log(err);
    }
  });
});