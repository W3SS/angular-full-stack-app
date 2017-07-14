var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var Message = require('../models/message');
var User = require('../models/user');

router.get('/',(req, res, next) => {
    Message.find()
        .populate('user', 'firstName')
        .exec((err, messages) => {
            if (err) {
                return res.status(500).json({
                    title: 'An error occured',
                    error: err
            });
        }
        res.status(200).json({
            message: 'Success',
            obj: messages
        });
     });
});

//Users should be able to reach the following routes only if authenticated

router.use('/', (req, res, next) => {
    //check is the user(browser) is sending a valid token
    jwt.verify(req.query.token, 'secret', (err, decoded) => {
        if (err){
            return res.status(401).json({
                title: 'User Not Authenticated',
                //error: err
                error:{message: 'You must login before posting. '+
                                'Please login or signup.'}
            });
        }
        next();
    })
});
router.patch('/:id', (req, res, next) => {
    var decoded = jwt.decode(req.query.token);
    Message.findById(req.params.id, (err, message) => {
        if (err){
            return res.status(500).json({
                title: 'An error occured',
                error: err
            });
        }
        if (!message){
            return res.status(500).json({
                title: 'No message found',
                error: {message: 'Message not found'}
            });
        }
        if(message.user != decoded.user._id){
            return res.status(401).json({
                title: 'Not Authenticated',
                error: {message: 'Users do not match'}
            });
        };
        message.content = req.body.content;
        message.save((err, result) => {
            if (err) {
            return res.status(500).json({
                title: 'An error occured',
                error: err
                });
            }
            res.status(200).json({
                message: "Updated message",
                obj: result
            });
        });
     });
});

router.delete('/:id', (req, res, next) => {
    var decoded = jwt.decode(req.query.token);    
    Message.findById(req.params.id, (err, message) => {
        if (err){
            return res.status(500).json({
                title: 'An error occured',
                error: err
            });
        }
        if (!message){
            return res.status(500).json({
                title: 'No message found',
                error: {message: 'Message not found'}
            });
        }
        if(message.user != decoded.user._id){
            return res.status(401).json({
                title: 'Not Authenticated',
                error: {message: 'Users do not match'}
            });
        };
        message.remove((err, result) => {
            if (err) {
            return res.status(500).json({
                title: 'An error occured',
                error: err
            });
        }
        res.status(200).json({
             message: "Deleted message",
             obj: result
             });
        });
     });
});

router.post('/', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);
    //find the current user with the associated token sent with the request
    User.findById(decoded.user._id, (err, user) => {
        if (err) {
            return res.status(500).json({
                title: 'An error occured',
                error: err
            });
        }
        var message = new Message({
            content: req.body.content,
            user: user
        });
        message.save((err, result) => {
            if (err) {
                 return res.status(500).json({
                    title: 'An error occured',
                    error: err
                });
            }
            //update the current user's list of messages
            user.messages.push(result);
            user.save();
            res.status(201).json({
                message: "Saved message",
                obj: result
            });
        });
        
    });
});

module.exports = router;
