const UserModel = require('../../models/user.model/user.model');
const WorkerModel = require('../../models/worker.model/worker.model');
const WorkerOrderModel = require('../../models/worker.order.model/worker.order.model');
const BaseImpl = require('../base.impl/base.impl');

class AdminImpl extends BaseImpl {
    constructor(options) {
        super(options);
    };

    _createNewAdmin(){
        return new Promise((resolve, reject) => {
            this.addNewModel({model: UserModel}).then((newlyCreatedModel) => {
                resolve(newlyCreatedModel);
            }).catch((err) => {
                reject(err);
            })
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
            this.addNewModel({model: WorkerModel}).then((newlyCreatedWorkerModel) => {
                this.pushIntoParentModel({parentModelFindKey: {_id: this.options.adminId}, parentModel: UserModel, model: newlyCreatedWorkerModel, parentKey: 'workers'}).then(() => {
                    resolve(newlyCreatedWorkerModel);
                }).catch((err) => {
                    reject(err);
                });
            }).catch((err) => {
                reject(err);
            })
        });
    };

    _createNewOrder(){
        return new Promise((resolve, reject) => {
            this.addNewModel({model: WorkerOrderModel}).then((newlyCreatedOrderModel) => {
                this.pushIntoParentModel({parentModelFindKey: {_id: this.options.workerPartner}, parentModel: WorkerModel, model: newlyCreatedOrderModel, parentKey: 'orders'}).then(() => {
                    resolve(newlyCreatedOrderModel);
                }).catch((err) => {
                   reject(err);
                });
            }).catch((err) => {
                reject(err);
            });
        });
    };

    _listAllAdmins(){
        return new Promise((resolve, reject) => {
            this.getAllModels({model: UserModel, filterQuery: () => this.prepareFilterQuery({})})
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
        if(this.options.workerId){
            additionalQuery['_id'] = this.options.workerId;
        }
        return new Promise((resolve, reject) => {
           this.getAllModels({model: WorkerModel, filterQuery: (query) => this.prepareFilterQuery(query), additionalQuery})
               .then((result) => {
                resolve(result);
           }).catch((err) => {
               reject(err);
           });
        });
    };

    _listAllOrders(){
       const additionalQuery = {};
       if(this.options.adminId){
           additionalQuery['adminId'] = this.options.adminId;
       }
       if(this.options.workerId){
           additionalQuery['workerPartner'] = this.options.workerId;
       }
       return new Promise((resolve, reject) => {
          this.getAllModels({model: WorkerOrderModel, filterQuery: (query) => this.prepareFilterQuery(query), additionalQuery})
              .then((result) => {
                  resolve(result);
              }).catch((err) => {
                  reject(err);
          });
       });
    };
}

module.exports = AdminImpl;