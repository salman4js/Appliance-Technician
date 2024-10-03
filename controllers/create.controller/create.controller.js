const BaseController = require('../base.controller/base.controller');
const lang = require('./create.controller.lang');

class CreateController extends BaseController {
    constructor(options) {
        super(options);
    };

    async doAction(){
        this.options.implOptions = this.options.request?.body;
        this._addParamsInImplOptions();
        this._initiateAction().then((result) => {
            let response, statusCode = result?.statusCode;
            delete result?.statusCode;
            if(!result.notCreated){
                response = {statusCode: statusCode || 201, result: result, success: true};
            } else {
                response = {statusCode: statusCode || 400, message: result.message, success: false};
            }
            this.responseHandler.parser(this.options.response, response);
        }).catch((error) => {
            this.responseHandler.parser(this.options.response, {statusCode: 500, message: error.message, success: false, err: error.err, controllerLang: lang});
        });
    };
}

module.exports = CreateController;