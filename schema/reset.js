const mongo = require('mongoose')
const ResetPass = new mongo.Schema({
    username: { type: String, required: true, },
    mail_id: { type: String, required: true, },
    createdAt: { type: Date, default: new Date }
}, { collection: 'Password Reset' }, { timestamps: true });

ResetPass.index({ createdAt: 1 }, { expireAfterSeconds: 1800 })
const modal = mongo.model('ResetPass', ResetPass)
module.exports = modal;