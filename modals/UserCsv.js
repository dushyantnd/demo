const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userCsvSchema = new Schema({
    postId: String,
    id: String,
    body: String,
    name: String,
    email: String
});

module.exports = mongoose.model('UserCsv',userCsvSchema);
