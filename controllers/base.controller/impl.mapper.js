const UserImpl = require('../../implementations/user.impl/user.impl');
const AdminImpl = require('../../implementations/admin.impl/admin.impl');
const WorkerImpl = require('../../implementations/worker.impl/worker.impl');

const ImplMapper = {
    POST: {
        superAdmin: (options) => new AdminImpl(options)._createNewSuperAdmin(),
        admin: (options) => new AdminImpl(options)._createNewAdmin(),
        admin_worker: (options) => new AdminImpl(options)._createNewWorker(),
        admin_order: (options) => new AdminImpl(options)._createNewOrder(),
        login_user: (options) => new UserImpl(options)._authenticateUser()
    },
    GET: {
        admin: (options) => new AdminImpl(options)._listAllAdmins(),
        admin_worker: (options) => new AdminImpl(options)._listAllWorkers(),
        admin_order: (options) => new AdminImpl(options)._listAllOrders(),
        worker_order: (options) => new WorkerImpl(options)._listWorkerOrders(),
        widgets: (options) => new UserImpl(options)._listOfUserWidgets(),
        properties_form: (options) => new UserImpl(options)._getFormDialog()
    },
    PATCH: {
        admin: (options) => new AdminImpl(options)._updateAdminDetails(),
        worker: (options) => new WorkerImpl(options)._updateWorker(),
        order: (options) => new WorkerImpl(options)._updateWorkerOrder()
    },
    DELETE: {
        admin_order: (options) => new AdminImpl(options)._deleteOrder(),
        admin: (options) => new AdminImpl(options)._deleteNonSuperAdmin(),
        admin_worker: (options) => new AdminImpl(options)._deleteWorkers()
    }
}

module.exports = { ImplMappingObj: ImplMapper }