const { Sequelize } = require("sequelize");
module.exports = class DBContext{

    Server = "";
    Options = {};
    ServerType = 1;
    DB = null;
    IsDBActive = false;

    Models = {};

    constructor(Server, Options = {}){
        this.Server = Server;
        this.Options = Options;
    }

    Sync(){
        this.DB.sync();
    }

    Connect(){
        this.DB = new Sequelize({
            dialect : "sqlite",
            storage : this.Server
        });
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
