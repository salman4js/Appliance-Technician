const BaseImpl = require('../base.impl/base.impl');
const OrderImpl = require('../order.impl/order.impl');
const WorkerModel = require('../../models/worker.model/worker.model');
const BaseImplConstants = require("../base.impl/base.impl.constants");
const WorkerImplConstants = require('./worker.impl.constants');


class WorkerImpl extends BaseImpl {
    constructor(options) {
        super(options);
        this.orderImpl = new OrderImpl(options);
    };

    _createNewWorker(){
        return new Promise((resolve, reject) => {
            this.addNewModel({model: WorkerModel}).then((newlyCreatedWorkerModel) => {
                resolve(newlyCreatedWorkerModel);
            }).catch((err) => {
                reject({notCreated: true, message: BaseImplConstants.modelCreateError.cannotCreate, err: err})
            })
        });
    };

    _isWorkerHasPendingTasks(additionalQuery) {
        additionalQuery = additionalQuery || {};
        return new Promise((resolve, reject) => {
            this._listWorkers(additionalQuery).then((workerModel) => {
                resolve(workerModel[0].userPendingOrder > 0 || workerModel[0].userAcceptedPendingOrder > 0);
            }).catch((err) => {
                reject(err);
            });
        });
    };

    _listWorkers(additionalQuery){
        return new Promise((resolve, reject) => {
            this.getAllModels({model: WorkerModel, filterQuery: (query) => this.prepareFilterQuery(query), additionalQuery})
                .then((result) => {
                    resolve(result);
                }).catch((err) => {
                reject({message: BaseImplConstants.modelGenericError, err: err});
            });
        });
    };

    async _listWorkerOrders(additionalQuery){
        additionalQuery = additionalQuery || {};
        if(this.options.workerPartner){
            additionalQuery['workerPartner'] = this.options.workerPartner;
        }
        return await this.orderImpl._listOrders(additionalQuery);
    };

    // Check if the worker has enough balance to accept the order!
    _isWorkerHasBalance(additionalQuery){
        additionalQuery = additionalQuery || {};
        additionalQuery['_id'] = additionalQuery.workerPartner;
        return new Promise((resolve, reject) => {
            this._listWorkers(additionalQuery).then((workerModel) => {
                if(workerModel[0].userBalance > 0){
                    additionalQuery['_id'] = additionalQuery.orderId;
                    this.orderImpl._listOrders(additionalQuery).then((orderModel) => {
                        if(workerModel[0].userBalance >= orderModel[0].orderPrice){
                            resolve({isWorkerHasBal: true});
                        }
                    }).catch((err) => {
                        reject(err);
                    })
                } else {
                    resolve({isWorkerHasBal: false});
                }
            }).catch((err) => {
                reject(err);
            })
        });
    };

    // Admin and worker both can accept the order!
    _updateWorkerOrder(){
        return new Promise((resolve, reject) => {
            this._isWorkerHasBalance({workerPartner: this.options.workerPartner, orderId: this.parseMongooseId()}).then((res) => {
                if(res.isWorkerHasBal){
                    this.orderImpl._updateOrder({getUpdatedModel: true}).then((updatedModel) => {
                        if(this.options.isOrderAccepted){
                            const additionalQuery = {};
                            additionalQuery['_id'] = this.options.workerPartner;
                            this._listWorkers(additionalQuery).then((result) => {
                                this.options.selectedNodes = JSON.stringify(this.options.workerPartner);
                                this.updateExistingModel({model: WorkerModel, body: {userAcceptedPendingOrder: (result[0].userAcceptedPendingOrder || 0) + 1, userPendingOrder: result[0].userPendingOrder - 1, userBalance: result[0].userBalance - updatedModel.orderPrice}}).then((result) => {
                                    resolve(result);
                                }).catch((err) => {
                                    reject(err);
                                })
                            }).catch((err) => {
                                reject(err);
                            });
                        }
                    }).catch((err) => {
                        reject(err);
                    });
                } else {
                    resolve({message: WorkerImplConstants.notEnoughWorkerBal});
                }
            }).catch((err) => {
                reject(err);
            });

        });
    };

    _deleteWorker(){
        return new Promise((resolve, reject) => {
            this.deleteModels({model: WorkerModel}).then((result) => {
                resolve(result);
            }).catch((err) => {
                reject({notDeleted: true, message: BaseImplConstants.modelDeleteError.cannotDelete, err: err});
            });
        });
    };
}

module.exports = WorkerImpl;