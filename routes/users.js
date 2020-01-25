const express = require('express');
const router = express.Router();

const pgp = require('pg-promise')();
const connection = {
    host: 'localhost',
    port: 5432,
    database: 'facebook_db2',
}
const db = pgp(connection);

router.get('/all', (req, res) => {
    db.any('SELECT * FROM users')
    .then(function(data) {
        const response = {
            users: data
        }
        res.send(response);
    })
    .catch(function(error) {        
        res.send('An error occurred: ' + error);
    });
});

router.post('/register', (req, res) => {
    const user = req.body;
    db.none('INSERT INTO users(firstname, lastname, age) VALUES($1, $2, $3)', [user.firstname, user.lastname, user.age])
    .then(() => {
        let response = {
            addedUser: req
        }
        res.send(response)
    })
    .catch(error => {
        res.send("An error occurred: " + error)
    });
});

router.get("/:id/post", async (req, res) => {
  try{
    let posts = await db.any("SELECT * FROM posts WHERE poster_id = $1", req.params.id)
    res.status(200).json({
        posts,
        status: "success",
    })
  } catch (err) {
      console.log(err)
  }
})

module.exports = router;