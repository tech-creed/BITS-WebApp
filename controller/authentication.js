const User = require('../schema/user.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer");

// Security Token creation
const TokenLogin = (id) => {
    return jwt.sign({ id }, "!d0cdc9$6df%58!@b!492*%^fd!731443e@66b#*3714d*9#*42766*4aa38f55b0bd!e5a33%c8%7f7@b0f");
}
const TokenPasswordReset = (id) => {
    return jwt.sign({ id }, "$e#dfd%%47bd&%df0#9e5&24753c3d%32a$61$6&94b841676@78f@b$906c#4cdffa368b7&3b54305@#@*");
}

// GET Auth controller
const LoginGet = (req, res) => {
    res.render("login", { error: null });
}
const SignupGet = (req, res) => {
    res.render("signup", { error: null });
}
const Dashboard = async(req, res) => {
    if (req.cookies.jwt) {
        const cookie_id = jwt.verify(req.cookies.jwt, "!d0cdc9$6df%58!@b!492*%^fd!731443e@66b#*3714d*9#*42766*4aa38f55b0bd!e5a33%c8%7f7@b0f");
        if (cookie_id) {
            const user = await User.findOne({ _id: cookie_id.id }).lean();
            res.render('dashboard', { userName: user['name'] })
        }
    } else {
        res.redirect('/auth/login')
    }
}

// POST Auth controller
const SignupPost = async(req, res) => {
    req.body["password"] = await bcrypt.hash(req.body["password"], 12);
    var newUser = new User(req.body);
    newUser.save().then((result) => {
        res.redirect('/auth/login');
    }).catch((error) => {
        if (error.code == 11000) { res.render("/auth/signup", { error: 'Username Already Exist' }); }
    })
}
const LoginPost = async(req, res) => {
    userFind = req.body
    const user = await User.findOne({ username: userFind.username }).lean()
    if (!user) {
        res.render("login", { error: "Username does Not Exist" });
    } else {
        if (await bcrypt.compare(userFind.password, user.password)) {
            const token = TokenLogin(user._id);
            res.cookie('credLogin', token, { httpOnly: true });
            res.redirect("/user/dashboard");
        } else {
            res.render("login", { error: "Password Incorrect" });
        }
        res.end()
    }
}

// logout function
const AuthLogout = async(req, res) => {
    res.cookie('credLogin', {}, { httpOnly: true, maxAge: 1 });
    res.redirect('/auth/login')
}

module.exports = { LoginGet, SignupGet, LoginPost, SignupPost, AuthLogout, Dashboard }