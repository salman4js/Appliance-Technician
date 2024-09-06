const BaseImplConstants = {
    modelGenericError: 'Internal server error occurred',
    modelPatchError: {
        selectedNodesMissing: 'ID must be provided to update the model',
        cannotUpdate: 'Cannot update the selected model'
    },
    modelCreateError: {
        cannotCreate: 'Cannot create new model',
        missingAdminId: 'Missing Admin ID',
        superAdminNeeded: 'Logged in user is not super admin to perform this operation'
    },
    modelDeleteError: {
        cannotDelete: 'Selected Node cannot be deleted!'
    }
}

module.exports = BaseImplConstants;