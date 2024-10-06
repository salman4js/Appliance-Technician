const _ = require('lodash');
const BaseImpl = require('../base.impl/base.impl');
const OrderImpl = require('../order.impl/order.impl');
const UserModel = require('../../models/user.model/user.model');
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
            if(this.options.userRole === 'superAdmin' || this.options.userRole === 'admin'){
                this.options.userRole = 'worker';
                this.addNewModel({model: WorkerModel}).then((workerModel) => {
                    this.addNewModel({model: UserModel, customOperation: (model) => {
                            model.workerId.push(workerModel._id);
                        }}).then((userModel) => {
                            this.pushIntoParentModel({parentModelFindKey: {_id: this.options.adminId}, parentKey: 'workerId', parentModel: UserModel, model: userModel}).then(() => {
                                resolve(_.zipWith([workerModel], [userModel], function(obj1, obj2){
                                    return _.merge({}, obj1, obj2)
                                }));
                            }).catch((err) => {
                                reject(err);
                            });
                    }).catch((err) => {
                        reject(err);
                    });
                }).catch((err) => {
                    reject({notCreated: true, message: BaseImplConstants.modelCreateError.cannotCreate, err: err})
                })
            } else {
                resolve({notCreated: true, message: WorkerImplConstants.mismatchUserRole});
            }
        });
    };

    _updateWorker(){
        return new Promise((resolve, reject) => {
            this.updateExistingModel({model: WorkerModel}).then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
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
            additionalQuery['userRole'] = 'worker';
            this.getAllModels({model: UserModel, filterQuery: (query) => this.prepareFilterQuery(query), additionalQuery}).then((usersModel) => {
                const workersId = [];
                usersModel.map((userModel) => {
                    workersId.push(userModel.workerId[0])
                });
                additionalQuery['_id'] = {$in: workersId};
                delete additionalQuery.adminId;
                delete additionalQuery.userRole;
                delete additionalQuery.userName;
                this.getAllModels({model: WorkerModel, filterQuery: (query) => this.prepareFilterQuery(query), additionalQuery})
                    .then((workersModel) => {
                        resolve(_.zipWith(workersModel, usersModel, function(obj1, obj2){
                            return _.merge({}, obj1, obj2)
                        }));
                    }).catch((err) => {
                    reject({message: BaseImplConstants.modelGenericError, err: err});
                });
            }).catch((err) => {
                reject(err);
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
        delete additionalQuery.workerPartner;
        return new Promise((resolve, reject) => {
            this._listWorkers(additionalQuery).then((workerModel) => {
                if(workerModel[0].userBalance > 0){
                    additionalQuery['_id'] = additionalQuery.orderId;
                    this.orderImpl._listOrders(additionalQuery).then((orderModel) => {
                        if(workerModel[0].userBalance >= orderModel[0].orderPrice){
                            resolve({isWorkerHasBal: true});
                        } else {
                            resolve({isWorkerHasBal: false});
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

    _updateWorkerTaskState(updatedOrderModel){
        return new Promise((resolve, reject) => {
            let additionalQuery = {}, patchBody;
            additionalQuery['_id'] = this.options.workerPartner;
            this._listWorkers(additionalQuery).then((result) => {
                this.options.selectedNodes = JSON.stringify(this.options.workerPartner);
                if(this.options.isOrderAccepted) patchBody = {userAcceptedPendingOrder: (result[0].userAcceptedPendingOrder || 0) + 1, userPendingOrder: result[0].userPendingOrder - 1, userBalance: result[0].userBalance - updatedOrderModel.orderPrice};
                if(this.options.isOrderCompleted) patchBody = {userOrderCompletion: (result[0].userOrderCompletion || 0) + 1, userAcceptedPendingOrder: result[0].userAcceptedPendingOrder -1};
                this.updateExistingModel({model: WorkerModel, body: patchBody}).then((result) => {
                    resolve(result);
                }).catch((err) => {
                    reject(err);
                })
            }).catch((err) => {
                reject(err);
            });
        });
    };

    // Admin and worker both can accept the order!
    _updateWorkerOrder(){
        return new Promise((resolve, reject) => {
            this._isWorkerHasBalance({workerPartner: this.options.workerPartner, orderId: this.parseMongooseId()}).then((res) => {
                if(res.isWorkerHasBal){
                    this.orderImpl._updateOrder({getUpdatedModel: true}).then((updatedOrderModel) => {
                        if(this.options.isOrderAccepted || this.options.isOrderCompleted){
                            this._updateWorkerTaskState(updatedOrderModel).then((result) => {
                                resolve(result);
                            }).catch((err) => {
                               reject(err);
                            });
                        }
                    }).catch((err) => {
                        reject(err);
                    });
                } else {
                    resolve({notUpdated: true, message: WorkerImplConstants.notEnoughWorkerBal});
                }
            }).catch((err) => {
                reject(err);
            });

        });
    };

    _deleteWorker(additionalQuery){
        return new Promise((resolve, reject) => {
            additionalQuery = additionalQuery || {};
            this.options.selectedNodes = this.deParseMongooseId(additionalQuery.userId);
            this.deleteModels({model: UserModel}).then(() => {
                delete this.options.selectedNodes;
                this.getAllModels({model: WorkerModel, filterQuery: (additionalQuery) => this.prepareFilterQuery(additionalQuery), additionalQuery: additionalQuery}).then((workerModel) => {
                    this.deleteModels({model: WorkerModel, deleteFilter: {_id: workerModel[0]._id}}).then((result) => {
                        resolve(result);
                    }).catch((err) => {
                        reject(err);
                    });
                }).catch((err) => {
                    reject(err);
                });
            }).catch((err) => {
                reject({notDeleted: true, message: BaseImplConstants.modelDeleteError.cannotDelete, err: err});
            });
        });
    };
}

module.exports = WorkerImpl;