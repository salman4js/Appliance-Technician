const Mongoose = require('mongoose');

const UserModel = new Mongoose.Schema({
    userName: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    userRole: {type: String, required: true}, // admin or superAdmin or worker
    workerId: [{
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Worker'
    }]
});

module.exports = Mongoose.model('UserModel', UserModel);