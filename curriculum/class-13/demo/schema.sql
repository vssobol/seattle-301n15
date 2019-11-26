DROP TABLE IF EXISTS tasks;

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    task VARCHAR(80),
    description text,
    status bool,
    category VARCHAR(255)
);

INSERT INTO tasks (task, description, status, category)
VALUES ('Task 1', 'This is the first task', false, 'tasks'),
     ('Task 2', 'This is the second task', false, 'tasks');
