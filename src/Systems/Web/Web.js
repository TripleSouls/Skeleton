const FileSystem = require("fs");
const ControllerParser = require("../Utils/ControllerParser");

const BodyParser = require("body-parser");
const CookieParser = require("cookie-parser");
const path = require("path");

module.exports = class Web{

    middlewares = [];
    App = undefined;
    Express = undefined;
    ControllersList = [];
    Routers = {};
    DefaultRoutePath = "Home";
    Modules = {};
    Databases = [];

    constructor(App, Express, Databases, opts){
        this.App = App;
        this.Express = Express;
        this.Opts = opts;
        this.Modules = opts?.Modules ?? {};
        this.Databases = Databases;
        this.PrepareRoute();
    }

    Start(){
        this.RunMiddlewares();
        this.App.listen(80, () => {
            this.Opts.Logger.Success("Server has been started. http://localhost:80", "SERVER");
        });
    }

    RunMiddlewares(){
        this.RunSystemMiddlewares();
        this.RunThirdPartyMiddlewares();

        this.App.use((Request, Response, Next) => {
            this.middlewares.map((mw, index) => {
                mw.Callback(Request, Response, Next);
            })
        })
    }

    RunSystemMiddlewares(){
        this.App.use((Request, Response, Next) => {
            this.Opts.Logger.Info("Request -> " + Request.url, "Middleware");
            Next();
        })
    }
    
    RunThirdPartyMiddlewares(){
        this.App.use(BodyParser.urlencoded({ extended : false }));
        this.App.use(BodyParser.json());
        this.App.use(CookieParser());
    }

    SetMiddleware(name, cb){
        this.middlewares.push({
            Name : name,
            Callback : cb
        })
    }

    RemoveMiddleware(name){
        for(let index = 0; index < this.middlewares.length; index++) {
            const mw = this.middlewares[index];
            if(mw.Name == name){
                this.RemoveMiddlewareByIndex(index);
                break;
            }
        }
    }

    RemoveMiddlewareByIndex(index){
        if(this.middlewares.length > index)
            delete this.middlewares[index];
    }

    PrepareRoute(){
        this.#PrepareAllControllers();
        this.#PrepareRoute();
        this.#RunRoute();
    }

    #PrepareAllControllers(){
        let location = this.Opts.globalVariables.DIRS.Controller;
        let all = FileSystem.readdirSync(location);
        let ControllersLocationList = [];
        all.map((controller) => {
            if(controller.includes("Controller.js"))
                ControllersLocationList.push(path.join(this.Opts.globalVariables.DIRS.Controller, controller));
        })
        
        let ControllerParserClass = new ControllerParser();

        ControllersLocationList.map((controller) => {
            let controllerRaw = require(controller);
            let controllerObj = new controllerRaw();
            this.ControllersList.push(ControllerParserClass.Parse(controllerRaw, controllerObj));
        });
    }
    
    #PrepareRoute(){
        this.ControllersList.map((controller) => {
            this.Routers[controller.Path[0]] = this.Express.Router();
            controller.Actions.map((action) => {
                let actionURL = "";
                if(action == "Index"){
                    this.#RouteWriter(controller.Path[0], actionURL, controller.Obj[action], controller.Obj.queryPostfix);
                }
                actionURL = action;
                this.#RouteWriter(controller.Path[0], actionURL, controller.Obj[action], controller.Obj.queryPostfix);
            });
        })
        /*
        this.Routers[controller.Path[0]].all("/", (req, res, next) => {
            controller.Obj[action](req, res, next, this.Databases, this.Modules);
        })
        */
    }

    #RouteWriter(path, action, callback, queryPostfix){
        if(typeof(queryPostfix) == typeof({}) && queryPostfix[action] !== undefined && queryPostfix[action] !== null){
            let actionsPostfix = queryPostfix[action];
            if(Array.isArray(actionsPostfix)){
                actionsPostfix.map((postfix) => {
                    const url = `${action}/${postfix}`.replace(/\/\//g, '/');
                    const formattedUrl = url.endsWith('/') ? url.slice(0, -1) : url;
                    this.#AddToRoute(path, formattedUrl, callback);
                });
            }else if(typeof(actionsPostfix) == typeof("")){
                const url = `${action}/${actionsPostfix}`;
                this.#AddToRoute(path, url, callback);
            }
        }else{
            this.#AddToRoute(path, action, callback);
        }
    }

    #AddToRoute(path, action, callback){
        action = action.startsWith("/") ? action : "/" + action;
        this.Routers[path].all(action, (req, res, next) => {
            callback(req, res, next, this.Databases, this.Modules);
        })
    }

    #RunRoute(){
        this.ControllersList.map((controller) => {
            let path = controller.Path[0];

            if(path == this.DefaultRoutePath)
                //örneğin Home class taki Index için hem /Home/Index hem /Index kabul edilecek.
                this.App.use("/", this.Routers[controller.Path[0]]);
            
            this.App.use("/" + path, this.Routers[controller.Path[0]]);
        })
    }

}