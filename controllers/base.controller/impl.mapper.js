const AdminImpl = require('../../implementations/admin.impl/admin.impl');

const ImplMapper = {
    POST: {
        admin: (options) => new AdminImpl(options)._createNewAdmin(),
        admin_new_worker: (options) => new AdminImpl(options)._createNewWorker(),
        admin_new_order: (options) => new AdminImpl(options)._createNewOrder()
    },
    GET: {
        admin: (options) => new AdminImpl(options)._listAllAdmins(),
        admin_worker: (options) => new AdminImpl(options)._listAllWorkers(),
        admin_order: (options) => new AdminImpl(options)._listAllOrders()
    },
    PATCH: {
        admin: (options) => new AdminImpl(options)._updateAdminDetails()
    }
}

module.exports = { ImplMappingObj: ImplMapper }