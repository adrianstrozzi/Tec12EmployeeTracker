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
  ("Lead Engineer", 150000, 2),
  ("Software Engineer", 120000, 2),
  ("Account Manager", 160000, 3),
  ("Accountant", 125000, 3),
  ("Legal Team Lead", 250000, 4),
  ("Lawyer", 190000, 4),
  ("Salesperson", 80000, 1),
  ("Sales Lead", 100000, 1);




INSERT INTO employee
  (first_name, last_name, role_id, manager_id)
VALUES
  ("Elliot", "Smith", 1, 1),
  ("Amira", "Afzal", 2, 2),
  ("Christoper", "Lee", 3, 2),
  ("Bruce", "Wayne", 4, NULL),
  ("Veronica", "Rodriguez", 5, 1),
  ("Julian", "Casablancas", 6, NULL),
  ("Alex", "Turner", 7, NULL),
  ("Caleb", "Followill", 8, 3);


INSERT INTO manager
  (first_name, last_name)
VALUES
  ("Bruce", "Wayne", 1, NULL),
  ("Alex", "Turner", 2, NULL),
  ("Julian", "Casablancas", 3, NULL)