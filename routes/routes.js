const Express = require("express");
const Router = Express.Router();
const CreateController = require('../controllers/create.controller/create.controller');
const ReadController = require('../controllers/read.controller/read.controller');
const EditController = require('../controllers/edit.controller/edit.controller');
const DeleteController = require("../controllers/delete.controller/delete.controller");

async function Initiator(options, method){
    var controller;
    switch(method){
        case "GET":
            controller = new ReadController(options);
            await controller.doAction().catch(options.next);
            break
        case "POST":
            controller = new CreateController(options);
            await controller.doAction().catch(options.next);
            break;
        case "PATCH":
            controller = new EditController(options);
            await controller.doAction().catch(options.next);
            break;
        case "DELETE":
            controller = new DeleteController(options);
            await controller.doAction().catch(options.next);
            break;
        default:
            break;
    }
}

// Authentication routes!
Router.post("/:repoName/login-user", (req, res, next) => Initiator({req, res, next}, "POST"));

// Widgets based routes!
Router.get("/:repoName/widgets-list",  (req, res, next) => Initiator({req, res, next}, "GET"));

// Admin read routes!
Router.get("/:repoName/get-repo-info",
    (req, res, next) => Initiator({req, res, next}, "GET"));

// Worker read routes!
Router.get("/:repoName/get-worker-orders",
    (req, res, next) => Initiator({req, res, next}, "GET"));

// Admin creation routes!

Router.post("/:repoName/create-super-admin",
    (req, res, next) => Initiator({req, res, next}, "POST"));

Router.post("/:repoName/create-admin",
    (req, res, next) => Initiator({req, res, next}, "POST"));

Router.post("/:repoName/create-worker",
    (req, res, next) => Initiator({req, res, next}, "POST"));

Router.post("/:repoName/create-new-order",
    (req, res, next) => Initiator({req, res, next}, "POST"));

// Admin update routes!
Router.patch("/:repoName/update-admin",
    (req, res, next) => Initiator({req, res, next}, "PATCH"));

// Worker update routes!
Router.patch("/:repoName/accept-worker-order",
    (req, res, next) => Initiator({req, res, next}, "PATCH"));

Router.patch("/:repoName/update-worker", (req, res, next) => Initiator({req, res, next}, "PATCH"));

// Admin delete routes!
Router.delete("/:repoName/admin-delete-order",
    (req, res, next) => Initiator({req, res, next}, "DELETE"));

Router.delete("/:repoName/admin-delete-non-admin",
    (req, res, next) => Initiator({req, res, next}, "DELETE"));

Router.delete("/:repoName/admin-delete-worker",  (req, res, next) => Initiator({req, res, next}, "DELETE"));

// Widget specific form dialog!
Router.get("/:repoName/properties-form-dialog", (req, res, next) => Initiator({req, res, next}, "GET"));

module.exports = Router;