const UserImplConstants = {
    noUserFound: 'No user has been found.',
    invalidCredentials: 'Please check your credentials.',
    userWidgets: {
        admin: [
            { widgetName: 'Technicians List', widgetLabel: 'admin_worker' },
            { widgetName: 'Orders List', widgetLabel: 'admin_order' }
        ],
        worker: [
            { widgetName: 'Orders List', widgetLabel: 'worker_order' }
        ],
        superAdmin: [
            { widgetName: 'Admins List', widgetLabel: 'admin' },
            { widgetName: 'Technicians List', widgetLabel: 'admin_worker' },
            { widgetName: 'Orders List', widgetLabel: 'admin_order' }
        ]
    },
    formDialog: {
        admin_worker: [
            {
                attribute: 'textField',
                placeholder: 'Technician User Name',
                name: 'userName',
                width: '100%',
                isRequired: true,
                inlineToast: {
                    isShow: false,
                    inlineToastColor: 'red',
                    inlineMessage: 'Technician User Name is required'
                }
            },
            {
                attribute: 'textField',
                placeholder: 'Password',
                name: 'password',
                width: '100%',
                isRequired: true,
                inlineToast: {
                    isShow: false,
                    inlineToastColor: 'red',
                    inlineMessage: 'Password is required'
                }
            },
            {
                attribute: 'textField',
                placeholder: 'Technician Initial Balance',
                name: 'userBalance',
                width: '100%',
                isRequired: true,
                inlineToast: {
                    isShow: false,
                    inlineToastColor: 'red',
                    inlineMessage: 'User Balance is required'
                }
            }
        ],
        admin_order: [
            {
                attribute: 'textField',
                placeholder: 'Order Name',
                name: 'orderName',
                width: '100%',
                isRequired: true,
                inlineToast: {
                    isShow: false,
                    inlineToastColor: 'red',
                    inlineMessage: 'Order Name is required'
                }
            },
            {
                attribute: 'textField',
                placeholder: 'Order Description',
                name: 'orderDesc',
                width: '100%',
                isRequired: true,
                inlineToast: {
                    isShow: false,
                    inlineToastColor: 'red',
                    inlineMessage: 'Order Desc is required'
                }
            },
            {
                attribute: 'textField',
                placeholder: 'Order Deadline',
                name: 'orderDeadline',
                width: '100%',
                isRequired: true,
                inlineToast: {
                    isShow: false,
                    inlineToastColor: 'red',
                    inlineMessage: 'Order Deadline is required'
                }
            },
            {
                attribute: 'textField',
                placeholder: 'Order Price',
                name: 'orderPrice',
                width: '100%',
                isRequired: true,
                inlineToast: {
                    isShow: false,
                    inlineToastColor: 'red',
                    inlineMessage: 'Order Price is required'
                }
            },
            {
                attribute: 'textField',
                value: new Date(),
                defaultValue: new Date(),
                placeholder: 'Order Placed',
                name: 'orderPlaced',
                width: '100%',
                restrictShow: true,
                isRequired: true,
                inlineToast: {
                    isShow: false,
                    inlineToastColor: 'red',
                    inlineMessage: 'Order Placed is required'
                }
            },
            {
                attribute: 'listField',
                placeholder: 'Select Technician',
                name: 'workerPartner',
                width: '100%',
                isRequired: true,
                async: true,
                options: undefined,
                asyncOptions: {
                    populationOptions: {
                        value: ['userName'],
                        actualValue: ['workerId'],
                    },
                    restResources: {
                        repoName: 'admin_worker',
                        linkRel: 'nodeItems',
                        method: 'get',
                        queryRequired: ['adminId']
                    },
                    populateIn: 'options',
                    populationRequired: true,
                    restResourceValue: undefined
                },
                inlineToast: {
                    isShow: false,
                    inlineToastColor: 'red',
                    inlineMessage: 'Technician field is mandatory.'
                }
            }
        ],
        worker_order: [
            {
                attribute: 'labelField',
                label: 'Order Name',
                name: 'orderName',
                width: '100%',
                customStyle: {
                    label: {color: 'grey', fontWeight: 'bold'},
                    value: {color: 'black', fontWeight: 'bold'}
                }
            },
            {
                attribute: 'labelField',
                label: 'Order Description',
                name: 'orderDesc',
                width: '100%',
                customStyle: {
                    label: {color: 'grey', fontWeight: 'bold'},
                    value: {color: 'black', fontWeight: 'bold'}
                }
            },
            {
                attribute: 'labelField',
                label: 'Order Deadline',
                name: 'orderDeadline',
                width: '100%',
                customStyle: {
                    label: {color: 'grey', fontWeight: 'bold'},
                    value: {color: 'black', fontWeight: 'bold'}
                }
            },
            {
                attribute: 'labelField',
                label: 'Order Price',
                name: 'orderPrice',
                width: '100%',
                customStyle: {
                    label: {color: 'grey', fontWeight: 'bold'},
                    value: {color: 'black', fontWeight: 'bold'}
                }
            },
            {
                attribute: 'labelField',
                value: new Date(),
                defaultValue: new Date(),
                label: 'Order Placed',
                name: 'orderPlaced',
                width: '100%',
                customStyle: {
                    label: {color: 'grey', fontWeight: 'bold'},
                    value: {color: 'black', fontWeight: 'bold'}
                }
            },
            {
                attribute: 'labelField',
                value: undefined,
                label: 'Order Accepted',
                name: 'isOrderAccepted',
                width: '100%',
                customStyle: {
                    label: {color: 'grey', fontWeight: 'bold'},
                    value: {color: 'black', fontWeight: 'bold'}
                }
            },
            {
                attribute: 'labelField',
                value: undefined,
                label: 'Order Completed',
                name: 'isOrderCompleted',
                width: '100%',
                customStyle: {
                    label: {color: 'grey', fontWeight: 'bold'},
                    value: {color: 'black', fontWeight: 'bold'}
                }
            }
        ],
    },
    missingUserRole: 'User role is missing.',
    missingWidgetInfo: 'Widget information is missing.'
};

module.exports = UserImplConstants;