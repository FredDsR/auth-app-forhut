const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');

const User = require('../models/User');

require('dotenv').config();

module.exports = {
    async index(req, res) {
        const users = await User.find().catch(error => {
            console.log(error);
            return res.status(400).send('Mongoose error');
        });

        return res.status(200).json({users: users});
    },

    async store(req, res) {
        const { username, bio, password }  = req.body;
        const user = {};
        
        if (!username) {
            return res.status(400).send('User name is required');
        }else if(!password){
            return res.status(400).send('Password is required');
        }else{
            const hash = await bcrypt.hash(password, 10).then(hash => {
                return hash;
            }).catch(err => {
                console.log(err);
            });
    
            await User.create({
                username,
                password: hash,
                bio
            }).then(res => {
                user.username = res.username;
                user.bio = res.bio;
            }).catch(error => {
                res.status(400).json({ error });
            });
        }

        return res.json(user);
    },

    async delete(req, res) {
        await User.deleteOne({_id : req.params.id}, error => {
            error ? null : res.status(200).json({ deleted: true });
        }).catch(error => {
            res.status(400).json({ deleted: error });
            console.log(error);
        });
    },

    async edit(req, res){
        const { username, bio, password }  = req.body;
        const user = {};

        if(username){
            await User.updateOne({_id : req.user.id}, {username}).then(() => {
                user.username = username;
            }).catch(error => {
                console.log(error);
            });
        }

        if(bio){
            await User.updateOne({_id : req.user.id}, {bio}).then(() => {
                user.bio = bio;
            }).catch(error => {
                console.log(error);
            });
        }

        if(password){
            const hash = await bcrypt.hash(req.body.password, 10).then(hash => {
                return hash;
            }).catch(err => {
                console.log(err);
            });

            await User.updateOne({_id : req.user.id}, {password: hash}).then(() => {
                user.password = 'Changed';
            }).catch(error => {
                console.log(error);
            })

        }

        return res.json({ user });
    },

    async view(req, res){
        await User.findById({_id : req.params.id}).then(user => {
            return res.json(user);
        }).catch(error => {
            console.log(error);
            return res.status(400).send('Not a good id');
        });
    },

    async login(req, res){
        const { username, password } = req.body;
        if (username && password) {
            const user = await User.findOne({username: username}).select('+password').catch(error => {
                res.status(401);
            });

            if (user) {
                const checkPass = await bcrypt.compare(password, user.password);
                if (checkPass) {
                    const payload = {id: user._id};
                    const token = jwt.encode(payload, process.env.JWT_SECRET);
                    res.json({
                        token: token
                    });
                }else{
                    res.status(401);
                }
            }else{
                res.status(401);
            }
        }else{
            res.status(401);
        }
    }
};
