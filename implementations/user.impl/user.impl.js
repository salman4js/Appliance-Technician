const _ = require('lodash');
const BaseImpl = require('../base.impl/base.impl');
const UserModel = require('../../models/user.model/user.model');
const UserImplConstants = require('./user.impl.constants');

class UserImpl extends BaseImpl {
    constructor(options) {
        super(options);
    };

    _authenticateUser(){
        return new Promise((resolve, reject) => {
            const additionalQuery = {};
            additionalQuery['userName'] = this.options.userName;
            this.getAllModels({model: UserModel, filterQuery: (query) => this.prepareFilterQuery(query), additionalQuery})
                .then((user) => {
                    if(_.isArray(user) && user.length > 0){
                        if(user[0].password === this.options.password){
                            const resp = {isLoggedIn: true, loggedInUserId: user[0]._id, loggedInUserRole: user[0].userRole};
                            if(resp.loggedInUserRole === 'worker') resp['loggedInWorkerId'] = user[0].workerId[0];
                            resolve(resp);
                        } else {
                            resolve({notCreated: true, message: UserImplConstants.invalidCredentials, statusCode: 401});
                        }
                    } else {
                        resolve({notCreated: true, message: UserImplConstants.noUserFound, statusCode: 401});
                    }
                }).catch((err) => {
                    reject(err);
            })
        });
    };

    _listOfUserWidgets(){
        return new Promise((resolve, reject) => {
            if(this.options.userRole){
                resolve(UserImplConstants.userWidgets[this.options.userRole]);
            } else {
                reject({message: UserImplConstants.missingUserRole});
            }
        });
    };

    _getFormDialog(){
        return new Promise((resolve, reject) => {
           if(this.options.widget){
                resolve(UserImplConstants.formDialog[this.options.widget]);
           } else {
               reject({message: UserImplConstants.missingWidgetInfo});
           }
        });
    };
}

module.exports = UserImpl;