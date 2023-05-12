const Controller = require("../../Systems/Controller")

module.exports = class ApiController extends Controller{

    path = "API";
    forcePath = true;

    constructor(){
        super();
    }
    Index(){

    }
    Home(){

    }
    About(req, res, next, Modules){
        res.send("API About");
    }
    #GetDB(){}
};