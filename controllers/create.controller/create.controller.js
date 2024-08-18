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
            if(!result?.notCreated){
                this.responseHandler.parser(this.options.response, {statusCode: 201, result: result, success: true});
            } else {
                this.responseHandler.parser(this.options.response, {statusCode: 400, message: result.message, success: false});
            }
        }).catch((error) => {
            console.log(error);
            this.responseHandler.parser(this.options.response, {statusCode: 500, message: error.message, success: false, err: error.err, controllerLang: lang});
        });
    };
}

module.exports = CreateController;