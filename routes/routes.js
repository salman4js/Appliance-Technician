const Express = require("express");
const Router = Express.Router();
const CreateController = require('../controllers/create.controller/create.controller');
const ReadController = require('../controllers/read.controller/read.controller');
const EditController = require('../controllers/edit.controller/edit.controller');

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
        default:
            break;
    }
}

// Admin read routes!
Router.get("/:repoName/get-admins-info",
    (req, res, next) => Initiator({req, res, next}, "GET"));

Router.get("/:repoName/get-admins-worker-info",
    (req, res, next) => Initiator({req, res, next}, "GET"));

Router.get("/:repoName/get-admins-orders-info",
    (req, res,next) => Initiator({req, res, next}, "GET"));

// Admin creation routes!
Router.post("/:repoName/create-admin",
    (req, res, next) => Initiator({req, res, next}, "POST"));

Router.post("/:repoName/create-worker",
    (req, res, next) => Initiator({req, res, next}, "POST"));

Router.post("/:repoName/create-new-order",
    (req, res, next) => Initiator({req, res, next}, "POST"));

// Admin update routes!
Router.patch("/:repoName/update-admin",
    (req, res, next) => Initiator({req, res, next}, "PATCH"));

module.exports = Router;