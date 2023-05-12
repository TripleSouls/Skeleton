module.exports = class HookSystem{

    hooks = {};
    globalVariables = {};

    constructor(){
        this.hooks = {
            Before : {
                Boot : [],
                WebServerStart : [],
                ApplicationStart : [],
                ControllerLoad : [],
                ControllerStart : []
            },
            AtTheMoment : {
                WebServerStart : [],
                ApplicationStart : [],
                ControllerLoad : [],
                ControllerStart : []
            },
            After : {
                Boot : [],
                WebServerStart : [],
                ApplicationStart : [],
                ControllerLoad : [],
                ControllerStart : []
            }
        }
    }

    AddAction(when, where, callback){
        if(!this.hooks.hasOwnProperty(when)) this.hooks[when] = {};
        if(!this.hooks[when].hasOwnProperty(where)) this.hooks[when][where] = [];
        
        (this.hooks[when][where]).push(callback);
    }

    RunAction(when, where, opt = {}){
        if(this.hooks?.[when]?.[where] == undefined || this.hooks?.[when]?.[where] == null)
        return;

        this.hooks?.[when]?.[where].map((callback, index) => {
            callback(this.globalVariables, opt, index);
        });
    }

    SetDefaultVariables(variables){
        this.globalVariables = variables;
    }

}