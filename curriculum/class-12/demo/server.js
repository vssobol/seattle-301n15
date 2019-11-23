'use strict';

const express = require('express');
const pg = require('pg');
require('dotenv').config();
const client = new pg.Client(process.env.DATABASE_URL);

const app = express();
const PORT = process.env.PORT || 3000;

// Express middleware
// Utilize ExpressJS functionality to parse the body of the request
app.use(express.urlencoded({extended: true}));
// Specify a directory for static resources
app.use(express.static('public'));

client.connect();
client.on('error', err => console.error(err));

// Set the view engine for server-side templating
app.set('view engine', 'ejs');

//the get route that will gather info to render the index page
app.get('/', getTodos);

// the /add route has two mthods.  First the 'get' will render the page with the form
app.get('/add', (req, res) => {
    res.render('pages/add');
})
// the post method on the /add route will take the info from the form and manage it
app.post('/add', addNewTask);

//this will take the id from the URL and use it to bring up details of only ONE task
app.get('/task/:task_id', getOneTask);


//HELPER FUNCTIONS
function getTodos(req, res) {
    let sql = 'SELECT * FROM tasks;';
    return client.query(sql)
    .then( response => {
        if (response.rowCount > 0 ) {
            res.render('index', {allTasks: response.rows});
        }
    })
}

function addNewTask(req, res){
    // console.log('add', req.body);
    let r = req.body;
    let sql = 'INSERT INTO tasks(task, description, status, category) VALUES($1, $2, $3, $4) RETURNING id;';
    let values = [r.task, r.description, r.status, r.category];
    client.query(sql, values)
    .then( result => {
        if(result.rowCount > 0){
            res.redirect('/');
        }
    })
}

function getOneTask(req, res) {
    // console.log(req.params.task_id);
    let sql = 'SELECT * FROM tasks WHERE id=$1;';
    // let id = [req.params.task_id]
    return client.query(sql, [req.params.task_id])
    .then(result => {
        if(result.rowCount >0 ){
            console.log('result',result.rows);
            res.render('pages/task', {taskDetail: result.rows});
        }
    })
}




app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));






//here goes the todos array
// let todos = [
//     {id: 1, task: 'Get some', description: 'Go out and get some', status: false},
//     {id: 2, task: 'Get some more', description: 'Go and get some more', status: false},
//     {id: 3, task: 'Too much', description: 'You got too much, give some back', status: false},
//     {id: 4, task: 'Wash car', description: 'Get your whip clean', status: false}
// ]

// //here goes the app.get('/') route to render array
// app.get('/', (req, res) => {
//     res.render('index', {allTasks: todos});
// })