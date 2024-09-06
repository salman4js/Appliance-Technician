const Mongoose = require('mongoose');

const WorkerModel = new Mongoose.Schema({
    userName: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    userRole: {type: String, required: true}, // worker
    userBalance: {type: Number, required: true},
    userOrderCompletion: {type: Number, default: 0},
    userPendingOrder: {type: Number, default: 0},
    userAcceptedPendingOrder: {type: Number, default: 0},
    orders: [{
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'WorkerOrders'
    }],
    adminId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
        required: true
    }
});

module.exports = Mongoose.model('WorkerModel', WorkerModel);