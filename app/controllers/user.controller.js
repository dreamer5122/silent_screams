const db = require("../models");
const User = db.users;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

async function validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}


module.exports.signUp = async (req, res) => {
    try {
        const { userName, password } = req.body;
        
        const hashedPassword = await hashPassword(password);
        // console.log(userName, hashedPassword);

        const newUser = await User.create({
            userName: userName,
            password: hashedPassword
        });

        return res.status(200).send({
            message: "created User",
            user: newUser
        });

    } catch(err) {
        return res.status(500).send(err);
    }
}

module.exports.signIn = async (req, res) => {
    try { 
        const { userName, password } = req.body;

        const user = await User.findOne({
            where: {
                userName: userName
            } 
        });

        if(!user) {
            return res.status(401).send({
                error: 'User Does Not Exist With this UserName'
            })
        }

        const validPassword = await validatePassword(password, user.password);
        if(!validPassword) {
            return res.status(401).send({
                error: "Incorrect Password"
            })
        }

        const accessToken = jwt.sign({
            userId: user.id
        }, "Secret Key",  
        {
            expiresIn: "1d"
        });

       const updated =  await User.update({
            token: accessToken
        },
        {
            where: {
                id: user.id
            }
        });
        // console.log(updated);
        res.status(200).send({
            token: accessToken,
            message: "success"
        });
    } catch(err) {
        return res.send(err);
    }
}