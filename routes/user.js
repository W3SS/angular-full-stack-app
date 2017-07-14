var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var User = require('../models/user');

router.get('/', function (req, res, next) {
    res.render('index');
});

module.exports = router;
var express = require('express');
var router = express.Router();

router.post('/signin', function (req, res, next){
   User.findOne({email: req.body.email}, function(err, user){
       if (err){
           return res.status(500).json({
                title: "An error occured",
                error: err
            });
       }
       if (!user){
           return res.status(401).json({
                title: 'Login failed',
                error: {message: 'Invalid login credentials'}
            });
       }
       if (!bcrypt.compareSync(req.body.password, user.password)){
           return res.status(401).json({
                title: 'Login failed',
                error: {message: 'Invalid login credentials'}
            });
       }
       var token = jwt.sign({user: user}, 'secret',{expiresIn: 3600});
       res.status(200).json({
           message: 'Successfully logged in',
           token: token,
           userId: user._id, 
           firstName: user.firstName
       });
   });
});

router.post('/', function (req, res, next) {
    var user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: bcrypt.hashSync(req.body.password,10),
        email: req.body.email
    });
    user.save((err, result) => {
        if (err){
            return res.status(500).json({
                title: "An error occured",
                error: err
            });
        }
        res.status(201).json({
            message: 'user created',
            obj: result
        });
    });     
});

module.exports = router;
