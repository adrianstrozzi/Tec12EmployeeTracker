const inquirer = require('inquirer');
const mysql = require('mysql2');
const { printTable } = require('console-table-printer');

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
      message: 'Please choose from the options below:',
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
        updateEmployeeRole();
      }
    })

  function viewEmployees() {
    console.log('Viewing all Employees...');
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
    console.log('Viewing all Departments...');
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
    console.log('Viewing all Roles...');
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

  function addDepartment() {
    inquirer.prompt([
      {
        type: 'input',
        name: 'addDepartment',
        message: 'Please write the name for the new Department:',
        validate: inputDepartmentName => {
          if (inputDepartmentName) {
            return true;
          } else {
            console.log('Please enter a name!');
          }
        }
      },
    ])

      .then(saveDepartmentName => {

        const newDepartmentName = saveDepartmentName.addDepartment

        console.log('Creating New Department...');

        const sql = `INSERT INTO department (name) VALUES (?)`
        const params = [newDepartmentName]
        db.query(sql, params, async function (err, res) {
          if (err) throw (err);
          try {
            console.log("\n");
            console.log('Added new Departmen!');
            console.log("\n");
            await promptMainMenu();
          }
          catch (err) {
            console.log(err);
          }
        })
      })
  }

  function addRole() {
    db.promise().query(`SELECT department.name, department.id FROM department`)
      .then(([tableRows]) => {
        var availableDepartments = tableRows.map(({ name, id }) => ({
          name: name,
          value: id
        }))

        inquirer.prompt([
          {
            type: 'input',
            name: 'roleTitle',
            message: 'Please write the title of the new Role:',
            validate: roleTitleInput => {
              if (roleTitleInput) {
                return true;
              } else {
                console.log('Please enter a Title!');
              }
            }
          },
          {
            type: 'input',
            name: 'roleSalary',
            message: 'Please write the salary for the new Role:',
            validate: roleSalaryInput => {
              if (roleSalaryInput) {
                return true;
              } else {
                console.log('Please enter a Salary!');
              }
            }
          },
          {
            type: 'list',
            name: 'roleDepartment',
            message: 'Please select a Department:',
            choices: availableDepartments
          },
        ])

          .then(({ roleTitle, roleSalary, roleDepartment }) => {

            console.log('Adding new Role...');
            const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
            const params = [roleTitle, roleSalary, roleDepartment];
            db.query(sql, params, async function (err, res) {
              if (err) throw (err);
              try {
                console.log("\n");
                console.log('Added new Role!');
                console.log("\n");
                await promptMainMenu();
              }
              catch (err) {
                console.log(err);
              }
            })
          })
      })
  }
  function addEmployee() {
    db.promise().query(`
    SELECT role.id, role.title FROM role
    `)
      .then(([tableRows]) => {
        let availableRoles = tableRows.map(({ id, title }) => ({
          name: title,
          value: id

        }));

        inquirer.prompt([

          {
            type: 'input',
            name: 'firstName',
            message: 'Please write the First Name of the new employee:',
            validate: firstNameInput => {
              if (firstNameInput) {
                return true;
              } else {
                console.log('Please enter First Name!');
              }
            }
          },
          {
            type: 'input',
            name: 'lastName',
            message: 'Please write the Last Name of the new employee:',
            validate: lastNameInput => {
              if (lastNameInput) {
                return true;
              } else {
                console.log('Please enter Last Name!');
              }
            }

          },
          {
            type: 'list',
            name: 'selectRole',
            message: 'Please select a Role for the new employee:',
            choices: availableRoles
          },
        ])
          .then(({ firstName, lastName, selectRole }) => {


            console.log('Adding new Employee...');
            const sql = `INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)`;
            const params = [firstName, lastName, selectRole];
            db.query(sql, params, async function (err, res) {
              if (err) throw (err);
              try {
                console.log("\n");
                console.log('Added new Employee!')
                console.log("\n");
                await promptMainMenu();
              }
              catch (err) {
                console.log(err);
              }
            })
          })
      })
  }

  function updateEmployeeRole() {
    db.promise().query(`
    SELECT employee.last_name, employee.id, role.id, role.title 
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id`)
      .then(([tableRows]) => {
        let availableEmployees = tableRows.map(({ last_name, id }) => ({
          name: last_name,
          value: id
        }))
        let availableRoles = tableRows.map(({ id, title }) => ({
          name: title,
          value: id
        })
        );

        inquirer.prompt([

          {
            type: 'list',
            name: 'listedEmployees',
            message: 'Select an Employee to update Role:',
            choices: availableEmployees
          },
          {
            type: 'list',
            name: 'listedRoles',
            message: 'Select a new Role for the Employee:',
            choices: availableRoles
          }
        ])
          .then(({ listedEmployees, listedRoles }) => {


            console.log('Updating Employee Role...');
            const sql = `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`;
            const params = [listedEmployees, listedRoles];
            db.query(sql, params, async function (err, res) {
              if (err) throw (err);
              try {
                console.log("\n");
                console.log('Updated Employee Role!')
                console.log("\n");
                await promptMainMenu();
              }
              catch (err) {
                console.log(err);
              }
            })
          })
      })
  }
}
