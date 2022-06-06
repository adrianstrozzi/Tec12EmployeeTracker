const inquirer = require('inquirer');
const mysql = require('mysql2');
const { printTable } = require('console-table-printer');
const cTable = require('console.table');

const db = mysql.createConnection(
  {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'employees_db'
  });

db.connect(function () {

  console.log(
    `
      ┌───┬─┐┌─┬───┬┐──┌───┬┐──┌┬───┬───┐┌────┬───┬───┬───┬┐┌─┬───┬───┐
      │┌──┤│└┘││┌─┐││──│┌─┐│└┐┌┘│┌──┤┌──┘│┌┐┌┐│┌─┐│┌─┐│┌─┐│││┌┤┌──┤┌─┐│
      │└──┤┌┐┌┐│└─┘││──││─│├┐└┘┌┤└──┤└──┐└┘││└┤└─┘││─│││─└┤└┘┘│└──┤└─┘│
      │┌──┤│││││┌──┤│─┌┤│─││└┐┌┘│┌──┤┌──┘──││─│┌┐┌┤└─┘││─┌┤┌┐││┌──┤┌┐┌┘
      │└──┤││││││──│└─┘│└─┘│─││─│└──┤└──┐──││─│││└┤┌─┐│└─┘│││└┤└──┤││└┐
      └───┴┘└┘└┴┘──└───┴───┘─└┘─└───┴───┘──└┘─└┘└─┴┘─└┴───┴┘└─┴───┴┘└─┘
    `
  )

  showMainMenu()
});

const showMainMenu = () => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'mainMenu',
      message: 'Plase choose from the options below:',
      choices: ['Show All Employees', 'Show Departments', 'Show Roles']
    },
  ])

    .then(answer => {
      if (answer.mainMenu === 'Show All Employees') {
        showEmployees();
      }
      else if (answer.mainMenu === 'Show Departments') {
        showDepartment();
      }
      else if (answer.mainMenu === 'Show Roles') {
        showRole();
      }
    })

  function showEmployees() {
    console.log('Viewing all Employees');
    db.query('SELECT * FROM employee',
      function (err, res) {
        if (err) throw err;
        printTable(res);
        showMainMenu();
      });
  }

  function showDepartment() {
    console.log('Viewing all Employees');
    db.query('SELECT * FROM department',
      function (err, res) {
        if (err) throw err;
        printTable(res);
        showMainMenu();
      });
  }

  function showRole() {
    console.log('Viewing all Employees');
    db.query('SELECT * FROM role',
      function (err, res) {
        if (err) throw err;
        printTable(res);
        showMainMenu();
      });
  }
}