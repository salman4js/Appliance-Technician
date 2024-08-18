const BaseController = require('../base.controller/base.controller');
const lang = require('./edit.controller.lang');

class EditController extends BaseController {
    constructor(options) {
        super(options);
    };

    async doAction(){
        this.options.implOptions = this.options.request.body;
        this._addParamsInImplOptions();
        this._initiateAction().then((result) => {
            if(!result?.notUpdated){
                this.responseHandler.parser(this.options.response, {statusCode: 200, result: result, success: true});
            } else {
                this.responseHandler.parser(this.options.response, {statusCode: 200, message: result.message, success: false});
            }
        }).catch((error) => {
            console.log(error)
            this.responseHandler.parser(this.options.response, {statusCode: 500, message: error.message, success: false, err: error.err, controllerLang: lang});
        });
    };
}

module.exports = EditController;