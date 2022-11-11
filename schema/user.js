const mongo = require('mongoose')

const UserSchema = new mongo.Schema({
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true, },
    mail:{type:String,required:true},
    password: { type: String, required: true }
}, { collection: 'Users' });

const modal = mongo.model('UserSchema', UserSchema)

module.exports = modal;