const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const VerifyToken = require('./VerifyToken');

router.use(bodyParser.json());

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const config = require('../config');
const db = require('../database.js/authQueries');

router.post('/user', async (req, res) => {
    try {
        const userCreated = await db.addUser({
            id: uuidv4(),
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        });
        const token = jwt.sign({ id: userCreated.id }, config.secret, {
            expiresIn: 86400, // expires in 24 hours
        });
        if (userCreated) res.status(200).send({ auth: true, token });
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

router.get('/me', VerifyToken, async (req, res, next) => {
    const user = await db.findUserById(req.userId);
    if (!user) return res.status(404).send('No user found.');
    res.status(200).send(user);
});

router.post('/login', async function (req, res) {
    const user = await db.findUserByEmail(req.body.email);
    if (!user) return res.status(404).send('No user found.');

    //const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    console.log(user.password, req.body.password);
    if (!(user.password === req.body.password)) return res.status(401).send({ auth: false, token: null });

    const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // expires in 24 hours
    });

    res.status(200).send({ auth: true, token: token });
});

router.get('/logout', function (req, res) {
    res.status(200).send({ auth: false, token: null });
});

router.use(function (user, req, res, next) {
    res.status(200).send(user);
});

module.exports = router;
