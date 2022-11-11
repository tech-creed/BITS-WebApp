const User = require('../schema/user.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer");

const LoginGet = (req, res) => {
    res.render("login", { error: null });
}

const SignupGet = (req, res) => {
    res.render("signup", { error: null });
}

module.exports = { LoginGet, SignupGet }
