const AdminImpl = require('../../implementations/admin.impl/admin.impl');
const WorkerImpl = require('../../implementations/worker.impl/worker.impl');

const ImplMapper = {
    POST: {
        admin: (options) => new AdminImpl(options)._createNewAdmin(),
        admin_new_worker: (options) => new AdminImpl(options)._createNewWorker(),
        admin_new_order: (options) => new AdminImpl(options)._createNewOrder()
    },
    GET: {
        admin: (options) => new AdminImpl(options)._listAllAdmins(),
        admin_worker: (options) => new AdminImpl(options)._listAllWorkers(),
        admin_order: (options) => new AdminImpl(options)._listAllOrders(),
        worker_order: (options) => new WorkerImpl(options)._listWorkerOrders()
    },
    PATCH: {
        admin: (options) => new AdminImpl(options)._updateAdminDetails(),
        worker: (options) => new WorkerImpl(options)._updateWorkerOrder()
    },
    DELETE: {
        admin_order: (options) => new AdminImpl(options)._deleteOrder(),
        admin: (options) => new AdminImpl(options)._deleteNonSuperAdmin(),
        admin_worker: (options) => new AdminImpl(options)._deleteWorkers()
    }
}

module.exports = { ImplMappingObj: ImplMapper }