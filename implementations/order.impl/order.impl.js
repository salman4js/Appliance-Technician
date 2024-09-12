const BaseImpl = require('../base.impl/base.impl');
const WorkerOrderModel = require("../../models/worker.order.model/worker.order.model");
const BaseImplConstants = require("../base.impl/base.impl.constants");


class OrderImpl extends BaseImpl {

    constructor(options) {
        super(options);
    };

    _createNewOrder(){
        return new Promise((resolve, reject) => {
            if(this.options.adminId && this.options.workerPartner){
                this.addNewModel({model: WorkerOrderModel}).then((newlyCreatedOrderModel) => {
                    resolve(newlyCreatedOrderModel);
                }).catch((err) => {
                    reject({notCreated: true, message: BaseImplConstants.modelCreateError.cannotCreate, err: err});
                });
            } else {
                resolve({notCreated: true, message: BaseImplConstants.modelCreateError.cannotCreate});
            }
        });
    };

    _listOrders(additionalQuery){
        return new Promise((resolve, reject) => {
            this.getAllModels({model: WorkerOrderModel, filterQuery: (query) => this.prepareFilterQuery(query), additionalQuery})
                .then((result) => {
                    resolve(result);
                }).catch((err) => {
                reject({message: BaseImplConstants.modelGenericError, err: err});
            });
        });
    };

    _deleteOrder(){
        return new Promise((resolve, reject) => {
            this.deleteModels({model: WorkerOrderModel}).then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
        });
    };

    _updateOrder(options){
        return new Promise((resolve, reject) => {
            this.updateExistingModel({model: WorkerOrderModel, getUpdatedModel: options.getUpdatedModel}).then((result) => {
                resolve(result);
            }).catch((err) => {
                reject({notUpdated: true, message: BaseImplConstants.modelPatchError.cannotUpdate, err: err});
            });
        });
    };
}

module.exports = OrderImpl;