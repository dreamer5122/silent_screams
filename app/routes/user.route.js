module.exports = function (app) {
    const users = require('../controllers/user.controller');

    app.post('/signUp', users.signUp);
    app.post('/signIn', users.signIn);
}

