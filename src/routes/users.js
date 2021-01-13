const express = require('express');
const router = express.Router();
const User = require('../models/User');

const passport = require('passport');

router.get('/users/signin', (req, res) => {
res.render('users/signin');

});
 
router.get('/users/signup', (req , res) => {
res.render('users/signup');

});

router.post('/users/signin', passport.authenticate('local',{
    successRedirect:'/notes',
    failureRedirect:'/users/signin',
    failureFlash: true
}));




router.post('/users/signup', async (req , res) => {
    const {name, email, password, confirm_password} = req.body;
    const errors = [];
    console.log(req.body);
    if (name.length <= 0){
        errors.push({text: 'Pleas put your name'});

    }
    if (email.length <= 0){
        errors.push({text: 'Pleas put a correct email'});

    }
    if (password.length < 4){
        errors.push({text: 'Password must large than 4 characters'});

    }
    if ( password != confirm_password){
        errors.push({text: 'Password dont match'});

    }
    if (errors.length > 0 ) {
        res.render('users/signup', {errors,name,email,password,confirm_password});

    } else{
        const emailUser = await User.findOne({email: email});
        console.log('llega');
        //verify emaol//
        if (emailUser){
            req.flash('error_msg', 'the email is already in use');
            res.redirect('/users/signup');
        }
        
        const newUser = new User({name, email, password});
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        req.flash('success_msg','yuo are registered');
        res.redirect('/users/signin');
    }

    
} );

router.get('/users/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})



module.exports = router;