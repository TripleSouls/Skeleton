const { Sequelize } = require("sequelize");
module.exports = class DBContext{

    Server = "";
    Options = {};
    ServerType = 1;
    DB = null;
    IsDBActive = false;

    Models = {};

    constructor(Server, Options, ServerType = 1){
        this.Server = Server;
        this.Options = Options;
        this.ServerType = ServerType;

        this.#ParamsCheck(ServerType);
    }

    #ParamsCheck(ServerType){
        const { Username, Password, DatabaseName } = this.Options;
        if(ServerType == 1){
            //sqlite
        }else{
            //mysql
            if(!Username || !Password || !DatabaseName)
                throw new Errror("MySql connection need Username, Password and DatabaseName");
            
        }

    }

    Sync(){
        this.DB.sync();
    }

    Connect(){
        if(this.ServerType == 1){
            this.DB = new Sequelize({
                dialect : "sqlite",
                storage : this.Server
            });
        }else{
            const { Username, Password, DatabaseName } = this.Options;
            this.DB = new Sequelize({
                dialect : "mysql",
                host : this.Server,
                DatabaseName,
                Username,
                Password
            });
        }
    }

    async Check(){
        try{
            await this.DB.authenticate();
            this.IsDBActive = true;
            return true;
        }catch(error){
            console.error("error in db", error);
            throw new Error(error);
        }
    }

    async disconnect(){
        if(this.IsDBActive){
            try{
                await this.DB.close();
            }catch(error){
                console.error("error in db, ", error);
                throw new Error(error);
            }
        }
    }

    SetModel(ModelName, Model){
        this.Models[ModelName] = this.DB.define(ModelName,
            Model,
            {
                freezeTableName: true,
            }
        );
        return this.Models[ModelName];
    }

    GetModel(ModelName){
        return this.Models[ModelName] ?? null;
    }

}