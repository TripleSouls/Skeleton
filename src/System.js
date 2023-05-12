const path = require("path");
const FileSystem = require("fs");
const Expressr = require("express");
const WebSystem = require("./Systems/Web/Web");
const HookSystem = require("./Systems/Hooks/HookSystem");
const DBContext = require("./Systems/Database/dbContext");

module.exports = class System{

    globalVariables = {};
    Express     = undefined;
    App         = undefined;
    Web         = undefined;
    Logger      = undefined;
    HookSystem  = undefined;
    DBContext   = undefined;
    Databases   = [];

    constructor(){
        this.Prepare();
    }

    Boot(){
        this.#StartSystem();
    }

    #StartSystem(){
        this.Web.Start();
    }

    Prepare(){
        this.#PrepareGlobalVariables();

        this.HookSystem = new HookSystem();
        this.HookSystem.SetDefaultVariables(this.globalVariables);

        this.#PrepareFolders();
        this.#PrepareSystems();
        this.#PrepareDatabase();
    }

    LoadPlugins(){
        
    }

    #PrepareGlobalVariables(){
        this.globalVariables = {
            DIR : __dirname,
            DIRS : {
                Development : path.join(__dirname, "Development"),
                Model       : path.join(__dirname, "Development/Model"),
                View        : path.join(__dirname, "Development/View"),
                Controller  : path.join(__dirname, "Development/Controller"),
                Static      : path.join(__dirname, "Development/Static"),
            }
        }
    }

    #PrepareFolders(){
        for(const DirName in this.globalVariables.DIRS){
            let DirLocation = this.globalVariables.DIRS[DirName];
            if(!FileSystem.existsSync(DirLocation)){
                FileSystem.mkdirSync(DirLocation, { recursive : true });
            }
        }
    }

    #PrepareSystems(){
        this.Express = Expressr;
        this.App = this.Express();
        this.Logger = require("./Systems/Logger/Logger");
        this.Web = new WebSystem(this.App, this.Express, this.Databases, {Logger : this.Logger, globalVariables : this.globalVariables, Modules : {DBContext : this.DBContext} });
        this.DBContext = DBContext;
    }

    #PrepareDatabase(){
        let DatabaseFileLocation = path.join(this.globalVariables.DIRS.Development, "database.js");
        if(!FileSystem.existsSync(DatabaseFileLocation))
        return;

        try{
            let DatabaseModulesExport = require(DatabaseFileLocation);
            if(!Array.isArray(DatabaseModulesExport)){
                DatabaseModulesExport = [DatabaseModulesExport];
            }
            DatabaseModulesExport.map((databaseFunction) => {
                this.Databases.push(databaseFunction(DBContext, this.globalVariables));
            });
        }catch(error){
            console.error("Veritabanı eklenirken sorun oluştu.");
            console.error(error);
        }
    }

    GetHookSystem(){
        return this.HookSystem;
    }

}
