const BaseController = require('../base.controller/base.controller');
const lang = require("../create.controller/create.controller.lang");

class DeleteController extends BaseController {
    constructor(req, res, next) {
        super(req, res, next);
    };

    async doAction(){
        this.options.implOptions = this.options.request.body;
        this._addParamsInImplOptions();
        this._initiateAction().then((result) => {
            let response, statusCode = result?.statusCode;
            delete result?.statusCode;
            if(!result.notDeleted){
                response = {statusCode: statusCode || 204};
            } else {
                response = {statusCode: statusCode || 200, message: result.message, success: false};
            }
            this.responseHandler.parser(this.options.response, response);
        }).catch((error) => {
            this.responseHandler.parser(this.options.response, {statusCode: 500, message: error.message, success: false, err: error.err, controllerLang: lang});
        });
    };
}

module.exports = DeleteController;