const Mongoose = require('mongoose');

const WorkerOrders = new Mongoose.Schema({
    orderName: {type: String, required: true},
    orderDesc: {type: String, required: true},
    orderPlaced: {type: String, required: true},
    orderDeadline: {type: String, required: true},
    isOrderCompleted: {type: Boolean, default: false},
    workerPartner: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Workers',
        required: true
    },
    adminId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
        required: true
    }
});

module.exports = Mongoose.model('WorkerOrders', WorkerOrders);