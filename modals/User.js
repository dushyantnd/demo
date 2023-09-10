const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    postId: String,
    id: String,
    body: String,
    name: String,
    email: String
});

module.exports = mongoose.model('User',userSchema);
