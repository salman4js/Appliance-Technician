const _ = require('lodash');
const Mongoose = require('mongoose');
const BaseImplConstants = require('./base.impl.constants');

class BaseImpl {
    constructor(options) {
        this.options = options;
    };

    parseMongooseId(){
        return JSON.parse(this.options.selectedNodes).map(id => Mongoose.Types.ObjectId(id))
    };

    prepareFilterQuery(additionalQuery){
        const filter = {};
        if(this.options.selectedNodes){
            let selectedNodes = this.parseMongooseId();
            filter['_id'] = {$in: selectedNodes}
        }
        if(additionalQuery && !_.isEmpty(additionalQuery)){
            Object.keys(additionalQuery).forEach((query) => {
                filter[query] = additionalQuery[query];
            });
        }
        return filter;
    };

    addNewModel(options){
        return new Promise((resolve, reject) => {
           const model = new options.model(this.options);
           model.save().then(() => {
               resolve(model);
           }).catch((err) => {
               reject({notCreated: true, err: err, message: BaseImplConstants.modelGenericError});
           })
        });
    };

    pushIntoParentModel(options){
        return new Promise((resolve, reject) => {
            options.parentModel.findByIdAndUpdate(options.parentModelFindKey, {$push: {[options.parentKey]: options.model}}, {new: true}).then(() => {
                resolve();
            }).catch((err) => {
                reject(err);
            });
        });
    };

    updateExistingModel(options){
        return new Promise((resolve, reject) => {
            const selectedNodes = JSON.parse(this.options.selectedNodes);
            if(selectedNodes && selectedNodes.length > 0){
                options.model.updateMany({_id: selectedNodes}, options.body || this.options, {new: true}).then((updatedModel) => {
                    if(options.getUpdatedModel === true && selectedNodes.length){
                        options.model.findOne({_id: selectedNodes[0]}).then((updatedModel) => {
                            resolve(updatedModel);
                        }).catch((err) => {
                           reject({err: err, message: BaseImplConstants.modelReadError});
                        });
                    } else {
                        resolve(updatedModel);
                    }
                }).catch((err) => {
                    reject({nptUpdated: true, err: err, message: BaseImplConstants.modelGenericError})
                });
            } else {
                resolve({notUpdated: true, message: BaseImplConstants.modelPatchError.selectedNodesMissing});
            }
        });
    };

    getAllModels(options){
        return new Promise((resolve, reject) => {
            let QuerySearch;
            if(options.aggregateQuery){
                QuerySearch = options.model.aggregate(options.aggregateQuery(options.additionalQuery));
            } else {
                QuerySearch = options.model.find(options.filterQuery(options.additionalQuery));
            }
            if (this.options.fields) {
                QuerySearch = QuerySearch.select(this.options.fields);
            }
            QuerySearch.then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
        });
    };

    deleteModels(options){
        return new Promise((resolve, reject) => {
            const deleteFilter = {};
            if(this.options.selectedNodes){
                let selectedNodes = JSON.parse(this.options.selectedNodes).map(id => Mongoose.Types.ObjectId(id));
                deleteFilter['_id'] = {$in: selectedNodes}
            }
            options.model.deleteMany(deleteFilter._id, {new: true}).then((result) => {
                resolve(result)
            }).catch((err) => {
               reject({notDeleted: true, message: BaseImplConstants.modelGenericError, err: err});
            });
        });
    };
}

module.exports = BaseImpl;