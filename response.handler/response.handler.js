const lang = require('./response.handler.lang');

class ResponseHandler {
    // Send success response!
    static success(res, infoMessage, data) {
        res.status(200).json({
            success: true,
            infoMessage,
            data
        });
    };

    // Send error response!
    static error(res) {
        res.status(500).json({
            success: false,
            message: lang.InternalServerError
        });
    };

    // Bad Request
    static badRequest(res){
        res.status(400).json({
            success: false,
            message: lang.InputMessageIsNotReadable
        });
    };

    // Parser method!
    static staticParser(res, options){
        const responseHandler = new ResponseHandler();
        responseHandler.parser(res, options);
    };

    // Get status code!
    prepareStatusCode(options){
        this.statusCode = options.status ? 200 : 500;
        if(options.statusCode){
            this.statusCode = options.statusCode;
        }
    };

    // Handle creation of responseJSON!
    // This method adds data into the responseTxt.
    prepareResponseJSON(options, res){
        if(options?.constants?.status && options.name){
            options[options.name] = options.result;
            options.status = options.constants.status;
            options.statusCode = options.constants.statusCode;
            delete options.constants;
            delete options.name;
            delete options.result;
        }
        this.parser(res, options);
    };

    // Parser --> this method handles success and failure altogether!
    parser(res, options){
        this.prepareStatusCode(options);
        if(this.statusCode === 500){
            options = this.handleError(options);
        }
        res.status(this.statusCode).json(options);
    };

    static get ErrorCodes() {
        return {
            UNIQUE_CONSTRAINT: 11000,
            VALIDATION_ERROR: lang.ValidationError
        };
    };

    handleError(options) {
        if (this.isUniqueConstraintError(options)) {
            return this.handleUniqueConstraintError(options);
        }
        if (this.isValidationError(options)) {
            return this.handleValidationError(options);
        }
        // Handle other error types
        return this.handleGenericError(options);
    };


    handleUniqueConstraintError(options) {
        const field = Object.keys(options.err.keyValue)[0];
        return {
            statusCode: 400,
            message: options.controllerLang.uniqueConstraintError(field),
            success: false,
            err: {
                code: options.err.code,
                field: field,
                value: options.err.keyValue[field],
            }
        };
    };

    handleValidationError(options) {
        const errors = Object.values(options.err.errors).map(error => ({
            field: error.path,
            message: error.message,
        }));
        return {
            statusCode: 400,
            message: options.controllerLang.validationError,
            success: false,
            err: errors,
        };
    };

    isUniqueConstraintError(options) {
        return options.err.code && options.err.code === ResponseHandler.ErrorCodes.UNIQUE_CONSTRAINT;
    };

    isValidationError(options) {
        return options.err.name === ResponseHandler.ErrorCodes.VALIDATION_ERROR;
    };

    handleGenericError(options) {
        return {
            statusCode: 500,
            message: lang.GenericError,
            success: false,
            err: options.err.message,
        };
    };
}

module.exports = ResponseHandler;
