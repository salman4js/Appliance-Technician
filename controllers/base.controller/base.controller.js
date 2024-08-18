// Every controller should extend from base controller class!
const ResponseHandler = require("../../response.handler/response.handler");
const ImplMapper = require('./impl.mapper');

class BaseController {
    constructor(options) {
        this.implMapper = ImplMapper.ImplMappingObj;
        this.responseHandler = new ResponseHandler();
        this._prepareInitialValues(options);
    };

    _prepareInitialValues(options){
        this.options = {
            request: options.req,
            response: options.res,
            next: options.next,
            repoName: options?.req?.params?.repoName
        };
    };

    _addParamsInImplOptions(){
        if(!this.options.implOptions) this.options.implOptions = {};
        Object.keys(this.options.request.query).forEach((query) => {
            this.options.implOptions[query] = this.options.request.query[query];
        });
        Object.keys(this.options.request.params).forEach((param) => {
            this.options.implOptions[param] = this.options.request.params[param];
        });
    };

    // This method will be responsible for identify the correct implementation for the respective request.
    // Class extenders controllers can add their custom values or custom method in the implOptions.
    _initiateAction(){
        return new Promise((resolve, reject) => {
            this.implMapper[this.options.request.method][this.options.repoName](this.options.implOptions).then((result) => {
                resolve(result);
            }).catch((error) => {
                reject(error);
            });
        });
    };
}

module.exports = BaseController;