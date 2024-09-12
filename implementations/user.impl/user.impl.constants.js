const UserImplConstants = {
    noUserFound: 'No user has been found.',
    invalidCredentials: 'Please check your credentials.',
    userWidgets: {
        admin: [{widgetName: 'Technicians List', widgetLabel: 'worker'}, {widgetName: 'Orders List', widgetLabel: 'admin_order'}],
        worker: [{widgetName: 'Orders List', widgetLabel: 'worker_order'}],
        superAdmin: [{widgetName: 'Admins List', widgetLabel: 'admin'}, {widgetName: 'Technicians List', widgetLabel: 'worker'}, {widgetName: 'Orders List', widgetLabel: 'admin_order'}]
    },
    missingUserRole: 'User role is missing.'
}

module.exports = UserImplConstants;