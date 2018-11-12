const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cons = require('consolidate');
const dust = require('dustjs-helpers');
const { Pool, Client } = require('pg');

// db connection
const connect = 'postgresql://root:test123@localhost/recipebookdb';
const pool = new Pool({
    connectionString: connect,
})

const app = express();

//assign dust engine
app.engine('dust', cons.dust);

//load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'dust');

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//set public folder
app.use(express.static(path.join(__dirname, 'public')));


//home route
app.get('/', (req, res) => {
    pool.connect((err, client, done) => {
        if (err) throw err;
        client.query('SELECT * FROM recipes', (err, result) => {
            if (err) {
                console.log(err.stack);
            }
            res.render('index', {recipes: result.rows});
            done();
        });
    });
});

app.post('/add', (req, res) => {
    pool.connect((err, client, done) => {
        if (err) throw err;
        client.query('INSERT INTO recipes(name, ingredients, directions) VALUES($1, $2, $3)', [req.body.name, req.body.ingredients, req.body.directions], (err) => {
            if (err) {
                console.log(err.stack);
            }
            res.redirect('/');
            done();
        });
    });
});

app.post('/edit', (req, res) => {
    pool.connect((err, client, done) => {
        if (err) throw err;
        client.query('UPDATE recipes SET name=$1, ingredients=$2, directions=$3 WHERE id=$4',
            [req.body.name, req.body.ingredients, req.body.directions, req.body.id], (err) => {

            if (err) {
                console.log(err.stack);
            }
            res.redirect('/');
            done();
        });
    });
});

app.delete('/delete/:id', (req, res) => {
    pool.connect((err, client, done) => {
        if (err) throw err;
        client.query('DELETE FROM recipes WHERE id=$1', [req.params.id], (err) => {
            if (err) {
                console.log(err.stack);
            }
            done();
            res.send(200);
        });
    });
});




//start server
app.listen(5000, () => console.log("server start on port 5000..."));

