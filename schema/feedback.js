const mongo = require('mongoose')

const FeedSchema = new mongo.Schema({
    name: { type: String, required: true, },
    mail_id: { type: String, required: true, },
    feedback: { type: String, required: true }
}, { collection: 'Feedback' });

const modal = mongo.model('FeedSchema', FeedSchema)

module.exports = modal;