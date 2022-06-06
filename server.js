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

  promptMainMenu()
});

const promptMainMenu = () => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'mainMenu',
      message: 'Plase choose from the options below:',
      choices: ['View All Employees', 'View All Departments', 'View All Roles', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role']
    },
  ])

    .then(answer => {
      if (answer.mainMenu === 'View All Employees') {
        viewEmployees();
      }
      else if (answer.mainMenu === 'View All Departments') {
        viewDepartments();
      }
      else if (answer.mainMenu === 'View All Roles') {
        viewRoles();
      }
      else if (answer.mainMenu === 'Add Department') {
        addDepartment();
      }
      else if (answer.mainMenu === 'Add Role') {
        addRole();
      }
      else if (answer.mainMenu === 'Add Employee') {
        addEmployee();
      }
      else if (answer.mainMenu === 'Update Employee Role') {
        updateEmployee();
      }
    })

  function viewEmployees() {
    console.log('Viewing all Employees');
    db.query(`SELECT 
    employee.id AS ID,
    employee.first_name AS "First Name",
    employee.last_name AS "Last Name",
    CONCAT (manager.first_name, " ", manager.last_name) AS Manager,
    role.title AS Title, 
    role.salary AS Salary,
    department.name AS Department
    FROM employee
    LEFT JOIN manager ON employee.manager_id = manager.id
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    `,
      function (err, res) {
        if (err) throw err;
        printTable(res);
        promptMainMenu();
      });
  }

  function viewDepartments() {
    console.log('Viewing all Departments');
    db.query(`
    SELECT
    department.id AS ID,
    department.name AS "Department Name"
    FROM department`,
      function (err, res) {
        if (err) throw err;
        printTable(res);
        promptMainMenu();
      });
  }

  function viewRoles() {
    console.log('Viewing all Roles');
    db.query(`SELECT 
    role.id AS ID,
    role.title AS Title,
    role.salary AS Salary,
    department.name AS Department
    FROM role
    LEFT JOIN department ON role.department_id = department.id`,
      function (err, res) {
        if (err) throw err;
        printTable(res);
        promptMainMenu();
      });
  }
}