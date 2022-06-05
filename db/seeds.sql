INSERT INTO department
  (name)
VALUES
  ("Sales"),
  ("Engineering"),
  ("Finance"),
  ("Legal");

INSERT INTO role
  (title, salary, department_id)
VALUES
  ("Lead Engineer", 150000, 1),
  ("Software Engineer", 120000, 1),
  ("Account Manager", 160000, 2),
  ("Accountant", 125000, 2),
  ("Legal Team Lead", 250000, 3),
  ("Lawyer", 190000, 3),
  ("Salesperson", 80000, 4),
  ("Sales Lead", 100000, 4);




INSERT INTO employee
  (first_name, last_name, role_id, manager_id)
VALUES
  ("Elliot", "Smith", 1, NULL),
  ("Amira", "Afzal", 2, NULL),
  ("Christoper", "Lee", 3, NULL),
  ("Bruce", "Wayne", 4, 1),
  ("Veronica", "Rodriguez", 5, NULL),
  ("Julian", "Casablancas", 6, 2),
  ("Alex", "Turner", 7, 3);