const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const db = require('./app/models');
const path = require('path');
const User = db.users;
const jwt = require('jsonwebtoken');
const http = require('http');
const socketIo = require('socket.io');



// middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(cors());


// database
db.sequelize.sync({
    force: false
}).then(() => {
    console.log('sync database');
});

// Token Auth
app.use(async (req, res, next) => {
    if(req.headers["x-access-token"]) {
        const accessToken = req.headers["x-access-token"];
        const { userId, exp } = await jwt.verify(accessToken, "Secret Key");

        console.log(userId);
        
        if(exp < Date.now().valueOf() / 1000) {
            return res.status(401).json({
                error: "JWT token expired, please login"
            });
        }
        res.locals.loggedInUser = await User.findByPk(userId);
        console.log("finished here ")
        next();
    } else {
        next();
    }
})

// Static Site host
app.use('/', express.static(path.join(__dirname, 'public')));
// app.use('/chat', express.static(path.join(__dirname, 'public/chat.html')));

// Routes
require('./app/routes/issue.route')(app);
require('./app/routes/comment.route')(app);
require('./app/routes/category.route')(app);
require('./app/routes/user.route')(app);



const server = http.Server(app);

io = socketIo(server);

io.on('connection', (socket) => {
    console.log(socket.id);

    const users = [];

    for(let [id, socket] of io.of("/").sockets) {
        users.push({
            userId: id,
            userName: socket.userName
        })
    }

    socket.emit('greeting', {
        message: "hellow there "
    });

    socket.on('client_greeting', (message) => {
        socket.userName = message.userName;
        console.log(message.message);
    });

    socket.on('private message', (anotherSocketId, msg) => {
        socket.to(anotherSocketId).emit('private message', socket.id, msg);
        console.log(socket.id + ' message exchange');
        console.log('userName', socket.userName);
        console.log(msg);
    });

    socket.on('disconnect', () => {
        console.log('disconnected');
    })
});

// Set PORT
const PORT = process.env.PORT || 3000;

// Helmet for Protection
app.use(helmet());


// Start Server
server.listen(PORT, () => {
    console.log(`server started at ${PORT}`);
});