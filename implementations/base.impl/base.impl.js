const _ = require('lodash');
const Mongoose = require('mongoose');
const BaseImplConstants = require('./base.impl.constants');

class BaseImpl {
    constructor(options) {
        this.options = options;
    };

    prepareFilterQuery(additionalQuery){
        const filter = {};
        if(this.options.selectedNodes){
            let selectedNodes = JSON.parse(this.options.selectedNodes).map(id => Mongoose.Types.ObjectId(id));
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
            if(this.options?.selectedNodes && this.options?.selectedNodes.length > 0){
                options.model.updateMany({_id: this.options.selectedNodes}, this.options, {new: true}).then((updatedModel) => {
                    resolve(updatedModel);
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
}

module.exports = BaseImpl;