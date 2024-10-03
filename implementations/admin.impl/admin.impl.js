const _ = require('lodash');
const UserModel = require('../../models/user.model/user.model');
const WorkerModel = require('../../models/worker.model/worker.model');
const BaseImpl = require('../base.impl/base.impl');
const OrderImpl = require('../order.impl/order.impl');
const WorkerImpl = require('../worker.impl/worker.impl');
const BaseImplConstants = require("../base.impl/base.impl.constants");
const AdminImplConstants = require('./admin.impl.constants');

class AdminImpl extends BaseImpl {
    constructor(options) {
        super(options);
        this.workerImpl = new WorkerImpl(options);
        this.orderImpl = new OrderImpl(options);
    };

    _createNewSuperAdmin(){
        return new Promise((resolve, reject) => {
            if(this.options.userRole === 'superAdmin'){
                this.options.adminId = this._generateNewMongooseId();
                this.addNewModel({model: UserModel}).then((userModel) => {
                    resolve(userModel);
                }).catch((err) => {
                    reject(err);
                })
            } else {
                resolve({notCreated: true, message: AdminImplConstants.superAdminNeeded});
            }
        });
    };

    _isSuperAdmin(){
        // this method would return result for single object!
        return new Promise((resolve, reject) => {
           this._listAllAdmins().then((result) => {
               resolve(result[0]?.userRole === 'superAdmin');
           }).catch((err) => {
              reject(err);
           });
        });
    };

    _createNewAdmin(){
        return new Promise((resolve, reject) => {

            const self = this;

            function createNewAdmin(){
                self.options.adminId = self._generateNewMongooseId();
                self.addNewModel({model: UserModel}).then((userModel) => {
                    resolve(userModel);
                }).catch((err) => {
                    reject(err);
                })
            }

            if(this.options.selectedNodes){
                this._isSuperAdmin().then((isSuperAdmin) => {
                    if(isSuperAdmin){
                        createNewAdmin()
                    } else {
                        resolve({notCreated: true, message: BaseImplConstants.modelCreateError.superAdminNeeded})
                    }
                }).catch((err) => {
                    reject(err);
                });
            } else {
                if(this.options.userRoleQuery === 'superAdmin'){
                    createNewAdmin();
                } else {
                    resolve({notCreated: true, message: BaseImplConstants.modelCreateError.superAdminNeeded})
                }
            }
        });
    };

    // Admin cannot add or remove workers through this implementation.
    _updateAdminDetails(){
        return new Promise((resolve, reject) => {
            this.updateExistingModel({model: UserModel}).then((updatedModel) => {
                resolve(updatedModel);
            }).catch((err) => {
                reject(err);
            })
        });
    };

    _createNewWorker(){
        return new Promise((resolve, reject) => {
            if(this.options.adminId){
                this.workerImpl._createNewWorker().then((newlyCreatedWorkerModel) => {
                    resolve(newlyCreatedWorkerModel);
                }).catch((err) => {
                    reject(err);
                })
            } else {
                resolve({notCreated: true, message: BaseImplConstants.modelCreateError.missingAdminId});
            }
        });
    };

    _createNewOrder(){
        return new Promise((resolve, reject) => {
            this.orderImpl._createNewOrder().then((newlyCreatedOrderModel) => {
                const additionalQuery = {};
                additionalQuery['_id'] = this.options.workerPartner;
                this.getAllModels({model: WorkerModel, filterQuery: (query) => this.prepareFilterQuery(query), additionalQuery}).then((result) => {
                    this.options.selectedNodes = JSON.stringify(this.options.workerPartner);
                    this.updateExistingModel({model: WorkerModel, body: {userPendingOrder: (result[0]?.userPendingOrder || 0) + 1}}).then(() => {
                        this.pushIntoParentModel({parentModelFindKey: {_id: this.options.workerPartner}, parentModel: WorkerModel, model: newlyCreatedOrderModel, parentKey: 'orders'}).then(() => {
                            resolve(newlyCreatedOrderModel);
                        }).catch((err) => {
                            reject(err);
                        });
                    }).catch((err) => {
                       reject(err);
                    });
                }).catch((err) => {
                    reject(err);
                });
            }).catch((err) => {
                reject(err);
            });
        });
    };

    _listAllAdmins(additionalQuery){
        additionalQuery = additionalQuery || {};
        additionalQuery['userRole'] = {
            $in: ['superAdmin', 'admin']
        };
        return new Promise((resolve, reject) => {
            this.getAllModels({model: UserModel, filterQuery: (query) => this.prepareFilterQuery(query), additionalQuery})
                .then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
        });
    };

    _listAllWorkers(){
        const additionalQuery = {};
        // Come up with common logic to build filter query object based on query parameters!
        if(this.options.adminId){
            additionalQuery['adminId'] = this.options.adminId;
        }
        if(this.options.workerPartner){
            additionalQuery['_id'] = this.options.workerPartner;
        }
        return new Promise((resolve, reject) => {
           this.workerImpl._listWorkers(additionalQuery).then((result) => {
                resolve(result);
           }).catch((err) => {
               reject(err);
           });
        });
    };

    async _listAllOrders(){
       const additionalQuery = {};
       if(this.options.adminId){
           additionalQuery['adminId'] = this.options.adminId;
       }
       if(this.options.workerPartner){
           additionalQuery['workerPartner'] = this.options.workerPartner;
       }
       return await this.orderImpl._listOrders(additionalQuery);
    };

    async _deleteOrder(){
        await this.orderImpl._deleteOrder();
    };

    _deleteNonSuperAdmin(){
        return new Promise((resolve, reject) => {
           // Check if the selected node is super admin, if it's a super admin, restrict the account from being deleted.
           this._isSuperAdmin().then((superAdmin) => {
               if(!superAdmin){
                   this.deleteModels({model: UserModel}).then((result) => {
                       resolve(result);
                   }).catch((err) => {
                       reject(err);
                   });
               } else {
                   resolve({notDeleted: true, message: BaseImplConstants.modelDeleteError.cannotDelete, statusCode: 403});
               }
           }).catch((err) => {
               reject({notDeleted: true, message: BaseImplConstants.modelDeleteError.cannotDelete, err: err});
           });
        })
    };

    _deleteWorkers(){
        return new Promise((resolve, reject) => {
            const additionalQuery = {};
            // Check if the worker has any unfinished business task, if yes, don't allow the worker model to be deleted!
            if(this.options.selectedNodes){
                additionalQuery['userId'] = this.parseMongooseId()[0];
                delete this.options.selectedNodes;
            }
            this.workerImpl._isWorkerHasPendingTasks(additionalQuery).then((isWorkerHasPendingTasks) => {
               if(!isWorkerHasPendingTasks){
                   this.workerImpl._deleteWorker(additionalQuery).then((result) => {
                       resolve(result);
                   }).catch((err) => {
                       reject(err);
                   });
               } else {
                   resolve({notDeleted: true, message: BaseImplConstants.modelDeleteError.cannotDelete});
               }
            }).catch((err) => {
                reject(err);
            })
        });
    };
}

module.exports = AdminImpl;