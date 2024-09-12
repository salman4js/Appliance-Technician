const _ = require('lodash');
const BaseImpl = require('../base.impl/base.impl');
const UserModel = require('../../models/user.model/user.model');
const AuthImplConstants = require('./user.impl.constants');

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
                            resolve({isLoggedIn: true, loggedInUserId: user[0]._id, loggedInUserRole: user[0].userRole});
                        } else {
                            resolve(AuthImplConstants.invalidCredentials);
                        }
                    } else {
                        resolve(AuthImplConstants.noUserFound);
                    }
                }).catch((err) => {
                    reject(err);
            })
        });
    };

    _listOfUserWidgets(){
        return new Promise((resolve, reject) => {
            if(this.options.userRole){
                resolve(AuthImplConstants.userWidgets[this.options.userRole]);
            } else {
                reject({message: AuthImplConstants.missingUserRole});
            }
        });
    };
}

module.exports = UserImpl;