module.exports = class ControllerParser{

    constructor(){

    }

    Parse(Raw, Obj){
        let name = Obj.constructor.name ?? Raw.name;
        let params = Object.getOwnPropertyNames(Obj);
        let actions = Object.getOwnPropertyNames(Raw.prototype);
        if(name.endsWith("Controller") || name.endsWith("controller")){
            name = name.substring(0, name.length - 10);
        }
        
        let arr = [];
        actions.map((action) => {
            if(action != "constructor" && action != "Constructor") arr.push(action);
        })
        actions = arr;

        let path = [name];

        if(Obj.forcePath && Obj.path){
            path = [Obj.path];
        }else if(Obj.path){
            path.push(Obj.path)
        }

        return {
            Name : name,
            Path : path,
            Params : params,
            Actions : actions,
            Obj : Obj
        }
    }

}