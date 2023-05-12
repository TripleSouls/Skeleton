const Controller = require("../../Systems/Controller")

module.exports = class HomeController extends Controller{

    constructor(){
        super();
        this.queryPostfix = {
            Index : "",
            About : ["", "/:me"]
        };
    }
    Index(req, res, next, DBs){
        let db = DBs[0];
        db.GetModel("Post").findAll().then((v) => {
            let htmlCode = '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">';
            htmlCode += '<body><div class="container m-5 p-5">';
            v.map((vv) => {
                if(vv.IsPublished)
                    htmlCode += '<div class="card my-2 rounded"><div class="card-body"><h3 class="card-title">'+vv.Title+'</h3><p class="card-text">'+vv.Text+'</p></div></div>';
            })
            htmlCode += '</div></body>';
            res.send(htmlCode);
        });
    }
    Home(){

    }
    About(req, res){
        if(!req.params?.me ?? false)
        {
            res.send("About");
        }else{
            res.send("About " + req.params.me);
        }
    }
    AddNewPost(req, res, next, DBs){
        let f = DBs[0];
        f.GetModel("Post").create({ Title : "This Is Title 3", Text : "Lorem Ipsum", IsPublished : true }).then((v) => {
            res.json(v);
        })
    }
    #GetDB(){}
};