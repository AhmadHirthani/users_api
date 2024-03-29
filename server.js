'use strict'
// Application Dependencies
const express = require('express');
const pg = require('pg');
const methodOverride = require('method-override');
const superagent = require('superagent');
const cors = require('cors');
var bodyParser = require('body-parser');



// Environment variables
require('dotenv').config();

// Application Setup
const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());


// Express middleware
// Utilize ExpressJS functionality to parse the body of the request
app.use(express.urlencoded({
    extended: true
}));
// Specify a directory for static resources
app.use(express.static('public'));
// define our method-override reference
app.use(methodOverride('_method'));
// Set the view engine for server-side templating
app.set('view engine', 'ejs')
// Use app cors
app.use(cors());

// Database Setup
const client = new pg.Client(process.env.DATABASE_URL);

// app routes here
// -- WRITE YOUR ROUTES HERE --
app.get('/', homePage);
app.post('/', saveSimp);
app.post('/add_new_user', handleAddNewUser);
app.get('/send_notifications', handleSendNotifications);
app.post('/login', handleLogin);
app.put('/add_reg_token', handleAddRegToken);



app.get('/favorite-quotes', getFavPage);
app.get('/favorite-quotes/:quote_id', renderDetails);
app.delete('/favorite-quotes/:quote_id', handleDelete);
app.put('/favorite-quotes/:quote_id', handleEdit);

// callback functions
// -- WRITE YOUR CALLBACK FUNCTIONS FOR THE ROUTES HERE --

function handleSendNotifications(req, res) {
    let SQL = "SELECT * FROM users;";
    client.query(SQL).then(data => {
        const users = data.rows;
        res.render('users', {
            users
        });
    });
}

function handleAddRegToken(req, res) {
    //regToken
    // console.log("req.body",req.body);
    const { email, password, reg_token } = req.body;
    // console.log({firstName});
    let values = [email, password, reg_token];
    // console.log({values});
    const SQL = `SELECT * from users where email = '${email}';`;

    client.query(SQL, function (err, result) {
        if (err) {
            console.error(err);
            // res.status(500).send("Error: "+err.detail);
            res.status(500).json({ "status": false, "statusCode": 401, "msg": err.detail, "data": '()' })

            // return done(); // always close connection
        }
        else if (result.rows[0]) {
            // let user = result.rows[0]
            if (password === result.rows[0].password) {

                const SQL = `UPDATE users SET reg_token='${reg_token}' WHERE email='${email}' returning *;`;

                client.query(SQL, function (err, result) {
                    if (err) {
                        console.error(err);
                        // res.status(500).send("Error: "+err.detail);
                        res.status(500).json({ "status": false, "statusCode": 401, "msg": err.detail, "data": '()' })

                        // return done(); // always close connection
                    }
                    else  {
                        let user = result.rows[0]
                        console.log({ user });
                        // return your user
                        // res.send("Registration token has been added succsefully"); // always close connection
                        res.status(200).json({
                            "status": true, "statusCode": 200, "msg": "Registration token has been added succsefully",
                            "data": { "id": result.rows[0].id, "first_name": result.rows[0].first_name, "second_name": result.rows[0].second_name, "email": result.rows[0].email, "Registration Code": result.rows[0].reg_token }
                        })


                    }

                });



            }
            else {
                res.status(500).json({ "status": false, "statusCode": 401, "msg": "Wrong password", "data": '()' })

                // res.send("Wrong password"); // always close connection
            }
        } else {
            res.status(500).json({ "status": false, "statusCode": 401, "msg": "Wrong email", "data": '()' })


        }
    });




}

function handleLogin(req, res) {
    //regToken
    // console.log("req.body",req.body);
    const { email, password } = req.body;
    // console.log({firstName});
    let values = [email, password];
    // console.log({values});
    const SQL = `SELECT * from users where email = '${email}';`;

    client.query(SQL, function (err, result) {
        if (err) {
            console.error(err);
            // res.status(500).send("Error: "+err.detail);
            res.status(500).json({ "status": 500, "Response": err.detail })


            // return done(); // always close connection
        }
        else if (result.rows[0]) {
            let user = result.rows[0]
            console.log({ user });
            if (password === result.rows[0].password) {

                // res.send("right email and password"+"for the user ID: "+result.rows[0].id); // always close connection
                // res.status(200).json({"user_ID":result.rows[0].id,"first_name":result.rows[0].first_name,"second_name":result.rows[0].second_name,"email":result.rows[0].email })
                // res.status(200).json({"status":200,"id":result.rows[0].id,"first_name":result.rows[0].first_name,"second_name":result.rows[0].second_name,"email":result.rows[0].email })
                res.status(200).json({
                    "status": true, "statusCode": 200, "msg": "Login Successful",
                    "data": { "id": result.rows[0].id, "first_name": result.rows[0].first_name, "second_name": result.rows[0].second_name, "email": result.rows[0].email }
                })


            }
            else {
                // res.send("Wrong password"); // always close connection
                // res.status(500).json({"status":500,"Response":"Wrong password"})
                res.status(500).json({ "status": false, "statusCode": 401, "msg": "Wrong password", "data": '()' })


            }
        } else {
            res.status(500).json({ "status": false, "statusCode": 401, "msg": "Wrong email", "data": '()' })

        }
    });

}

function handleAddNewUser(req, res) {
    //regToken
    console.log("req.body", req.body);
    const {
        firstName,
        secondName,
        email, password
    } = req.body;
    // console.log({firstName});
    let values = [firstName, secondName, email, password];
    // console.log({values});
    const SQL = "INSERT INTO users ( first_name, second_name, email,password) values ($1,$2,$3,$4) returning *;";

    client.query(SQL, values, function (err, result) {
        if (err) {
            console.error(err);
            // res.status(500).send("Error: "+err.detail);
            res.status(500).json({ "status": false, "statusCode": 401, "msg": err.detail, "data": '()' })

            // return done(); // always close connection
        }
        else {
            let user = result.rows[0]
            console.log({ user });
            // return your user
            // res.send(result.rows[0].first_name+" "+result.rows[0].second_name+" has been added succsefully"); // always close connection
            res.status(200).json({
                "status": true, "statusCode": 200, "msg": "User created successfully",
                "data": { "id": result.rows[0].id, "first_name": result.rows[0].first_name, "second_name": result.rows[0].second_name, "email": result.rows[0].email }
            })

        }
    });

}





function homePage(req, res) {
    const url = 'https://thesimpsonsquoteapi.glitch.me/quotes?count=10';
    superagent.get(url).set('User-Agent', 'omar').then(data => {
        const retData = data.body;
        res.render('home', {
            retData
        });
    });
}

function saveSimp(req, res) {
    const {
        char,
        quote,
        img,
        dir
    } = req.body;
    let values = [quote, char, img, dir];
    const SQL = "INSERT INTO simpson (quote,character,image,characterDirection) values ($1,$2,$3,$4) returning *;";
    client.query(SQL, values).then(res.redirect('/favorite-quotes'));
}

function getFavPage(req, res) {
    let SQL = "SELECT * FROM simpson;";
    client.query(SQL).then(data => {
        const collection = data.rows;
        res.render('fav', {
            collection
        });
    });
}

function renderDetails(req, res) {
    const {
        quote_id
    } = req.params;
    let SQL = "SELECT * FROM simpson WHERE id=$1;";
    client.query(SQL, [quote_id]).then(data => {
        const rendData = data.rows;
        res.render('detail', {
            rendData
        });
    });
}

function handleEdit(req, res) {
    const id = req.params.quote_id;
    const newQuote = req.body.newQuote;
    const SQL = "UPDATE simpson SET quote=$1 WHERE id=$2 RETURNING * ;";
    client.query(SQL, [newQuote, id]).then(data => {
        res.redirect('/favorite-quotes');
    });
}

function handleDelete(req, res) {
    const id = req.params.quote_id;
    const SQL = "DELETE FROM simpson where id=$1 returning *;";
    client.query(SQL, [id]).then(data => {
        console.log(data.rowCount);
        res.redirect('/favorite-quotes')
    });
}
// helper functions

// app start point
client.connect().then(() =>
    app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))
);