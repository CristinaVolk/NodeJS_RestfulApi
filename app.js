const express = require('express');
global.__root = __dirname + '/';

const app = express();

app.get('/api', (req, res) => {
    res.status(200).send('API works.');
});

const AuthController = require(__root + 'auth/AuthController');
app.use('/api/auth', AuthController);

module.exports = app;
