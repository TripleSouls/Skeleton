//Burası sistem,n başlatıldığı bölüm.

const FileSystem    = require("fs");
const System        = require("./System");

const Application   = new System();
const HookSystem    = Application.GetHookSystem();

Application.LoadPlugins();

Application.Web.SetMiddleware("deneme", (req, res, next) => {
    res.status(404).send("404");
});

HookSystem.RunAction("Before", "Boot");
Application.Boot();
HookSystem.RunAction("After", "Boot");
