const Mongoose = require('mongoose');

const UserModel = new Mongoose.Schema({
    userName: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    userRole: {type: String, required: true}, // admin or superAdmin
    workers: [{
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Workers'
    }]
});

module.exports = Mongoose.model('UserModel', UserModel);