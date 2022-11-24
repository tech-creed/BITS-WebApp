const User = require('../schema/user.js')
const Feedback = require('../schema/feedback.js')
const Reset = require('../schema/reset.js')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, //secure port for modern apps with TLC encryption
  secure: false, //only true when using 465 port
  auth: {
    user: 'binarybeast.coders@gmail.com',
    pass: 'uejeqhqmsujxuqei'
  },
});
transporter.verify(function(error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Mail Server Check.................ok");
  }
});

const SendResetLink = async (mailto, tmpid, tmptoken, userid, tmpname) => {
  var redirect_link = 'https://bits-e-news.herokuapp.com/auth/reset_password/' + tmpid + '/' + tmptoken + '/' + userid;
  let info = await transporter.sendMail({
    from: 'binarybeast.coders@gmail.com',
    to: mailto,
    subject: "Authentication Password Reset",
    html: `<div style='background: linear-gradient(#acbac4, #2c3e50);text-align:center' ;>
        <br />
        <h1 style='text-align:left' ;>Hello ${tmpname},</h1>
        <h2><b><a href=${redirect_link} target='_blank'>Click To Reset Password</a></b></h2>
        <p>Link Will be expire in 30 minutes</p>
        <br />
        <p style="color:white;width: 100%;background-color: rgba(0, 0, 0, 0.192);">&copy; 2022</p>
        <br />
    </div>`
  });
}
const EmailVerificationGet = async (req, res) => {
  const user_verify = await User.findOne({
    _id: req.params.userid
  }).lean()
  const verify_db_find = await Reset.findOne({
    _id: req.params.tmpid
  }).lean()
  if (user_verify) {
    if (verify_db_find) {
      if (req.cookies.credLogin) {
        const verify_cookie = jwt.verify(req.cookies.credLogin, "$e#dfd%%47bd&%df0#9e5&24753c3d%32a$61$6&94b841676@78f@b$906c#4cdffa368b7&3b54305@#@*");
        if (verify_cookie) {
          res.render("password_change", {
            error: null
          })
        } else {
          res.render("feedback_forgot", {
            error: 'Session Expired'
          })
        }
      } else {
        res.render("feedback_forgot", {
          error: 'Session Expires'
        });
      }
    } else {
      res.render("feedback_forgot", {
        error: 'Link Expires'
      });
    }
  } else {
    res.render("feedback_forgot", {
      error: 'Invalid User'
    });
  }
}

// Security Token creation
const TokenLogin = (id) => {
  return jwt.sign({
    id
  }, "!d0cdc9$6df%58!@b!492*%^fd!731443e@66b#*3714d*9#*42766*4aa38f55b0bd!e5a33%c8%7f7@b0f");
}
const TokenPasswordReset = (id) => {
  return jwt.sign({
    id
  }, "$e#dfd%%47bd&%df0#9e5&24753c3d%32a$61$6&94b841676@78f@b$906c#4cdffa368b7&3b54305@#@*");
}

// GET Auth controller
const LoginSignupGet = (req, res) => {
  res.render("login_signup", {
    error: null
  });
}
const ResetFeedbackGet = (req, res) => {
  res.render("feedback_forgot", {
    error: null
  });
}

// POST Auth controller
const SignupPost = async (req, res) => {
  req.body["password"] = await bcrypt.hash(req.body["password"], 12);
  var newUser = new User(req.body);
  console.log(newUser)
  newUser.save().then((result) => {
    res.redirect('/auth/login_signup');
  }).catch((error) => {
    if (error.code == 11000) {
      res.render("login_signup", {
        error: 'Username Already Exist'
      });
    }
  })
}
const LoginPost = async (req, res) => {
  userFind = req.body
  const user = await User.findOne({
    username: userFind.username
  }).lean()
  if (!user) {
    res.render("login_signup", {
      error: "Username does Not Exist"
    });
  } else {
    if (await bcrypt.compare(userFind.password, user.password)) {
      const token = TokenLogin(user._id);
      res.cookie('credLogin', token, {
        httpOnly: true
      });
      res.redirect("/user/dashboard");
    } else {
      res.render("login_signup", {
        error: "Password Incorrect"
      });
    }
    res.end()
  }
}
const PasswordResetPost = async (req, res) => {
  var req_reset = new Reset(req.body);
  const user_reset = await User.findOne({
    username: req_reset.username
  }).lean()
  if (user_reset) {
    if (user_reset.mail == req.body['mail_id']) {
      req_reset.save()
        .then(async (result) => {
          const temp_data = await Reset.findOne({
            username: user_reset.username
          }).lean()
          const tmp_token = TokenPasswordReset(temp_data);
          res.cookie('credLogin', tmp_token, {
            httpOnly: true
          });
          SendResetLink(user_reset.mail, temp_data._id, tmp_token, user_reset._id, user_reset.name).catch(console.error);
          res.render('404', {
            msg: 'Check Registered E-Mail to Reset Password'
          })
        })
        .catch((error) => {
          console.log(error)
          res.render("feedback_forgot", {
            error: 'Username / Mail Invaild'
          });
        })
    } else {
      res.render("feedback_forgot", {
        error: 'Username & Mail Mismatch'
      });
    }
  } else {
    res.render("feedback_forgot", {
      error: 'Username Invaild'
    });
  }
}
const ChangePasswordPost = async (req, res) => {
  const get_cookie = jwt.verify(req.cookies.credLogin, "$e#dfd%%47bd&%df0#9e5&24753c3d%32a$61$6&94b841676@78f@b$906c#4cdffa368b7&3b54305@#@*");
  if (get_cookie) {
    const change_password_user = await User.findOne({
      username: get_cookie.id.username
    }).lean()
    if (change_password_user) {
      req.body["password"] = await bcrypt.hash(req.body["password"], 12);
      User.updateOne({
        "username": get_cookie.id.username
      }, {
        "password": req.body["password"]
      }, (err, result) => {
        if (err) {
          console.log(err)
        } else {
          res.cookie('credLogin', {}, {
            httpOnly: true,
            maxAge: 1
          });
          res.redirect('/auth/login_signup')
        }
      });
    } else {
      res.render("feedback_forgot", {
        error: 'Invalid User'
      })
    }
  } else {
    res.render("feedback_forgot", {
      error: 'Session Expired'
    })
  }
}
const FeedbackPost = async (req, res) => {
  var feed = new Feedback(req.body);
  feed.save().then((result) => {
    res.redirect('/')
  }).catch((error) => {
    console.log(error)
  })
}


// logout function
const AuthLogout = async (req, res) => {
  res.cookie('credLogin', {}, {
    httpOnly: true,
    maxAge: 1
  });
  res.redirect('/auth/login_signup')
}

module.exports = {
  LoginSignupGet,
  LoginPost,
  SignupPost,
  AuthLogout,
  ResetFeedbackGet,
  PasswordResetPost,
  FeedbackPost,
  ChangePasswordPost,
  EmailVerificationGet
}
