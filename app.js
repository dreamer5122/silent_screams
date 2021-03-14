const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const db = require('./app/models');
const path = require('path');
const User = require('./app/models/user.model');

app.use(helmet());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.use(cors());

db.sequelize.sync({
    force: false  
}).then(() => {
    console.log('sync database');
});

app.use(async (req, res, next) => {
    if(req.headers["x-access-token"]) {
        const accessToken = req.headers["x-access-token"];
        const { userId, exp } = await jwt.verify(accessToken, "Secret Key");
        
        if(exp < Date.now().valueOf() / 1000) {
            return res.status(401).json({
                error: "JWT token expired, please login"
            });
        }
        
        res.locals.loggedInUser = await User.findByPk(userId);
        
        next();
    } else {
        next();
    }
})

app.use('/', express.static(path.join(__dirname, 'public')));

require('./app/routes/issue.route')(app);
require('./app/routes/comment.route')(app);
require('./app/routes/category.route')(app);
require('./app/routes/user.route')(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`server started at ${PORT}`);
});