// function to select Element
const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);

const userName = urlParams.get('userName');

const selectElement = (element) => document.querySelector(element);

selectElement('.hamburger').addEventListener('click', () => {
    selectElement('.hamburger').classList.toggle('active');
    selectElement('.nav-list').classList.toggle('active');
})


var socket = io('http://localhost:3000');
socket.on('connect', () => {
    socket.userName = userName;
    console.log(socket.userName);
    socket.on('greeting', (message) => {
        console.log(message.message);
        console.log(socket.id);
         
        socket.emit('client_greeting', {
            userName: userName,
            message: "received"
        });
    });

    socket.on('private message', (from, msg) => {
        console.log(from, msg);
    });

    if(urlParams.get('to')) {
        const to = urlParams.get("to");
        socket.emit('private message', to, {
            message: "check message"
        });
        console.log("message sent");
    }
    
});