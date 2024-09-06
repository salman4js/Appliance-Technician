const BaseController = require('../base.controller/base.controller');
const lang = require('./read.controller.lang');

class ReadController extends BaseController {
    constructor(req, res, next) {
        super(req, res, next);
    };

    async doAction(){
        this._addParamsInImplOptions();
        this._initiateAction().then((result) => {
            this.responseHandler.parser(this.options.response, {statusCode: 200, result: result, success: true});
        }).catch((error) => {
            this.responseHandler.parser(this.options.response, {statusCode: 500, message: error.message, success: false, err: error.err, controllerLang: lang})
        })
    };
}

module.exports = ReadController;