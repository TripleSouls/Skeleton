/*
    Sistem otomatik olarak database.js e bakıyor ve export edilen
    modül bir fonksiyon mu yoksa dizi mi kontrol ediliyor.
    fonksiyonsa tek elemanlı diziye çevriliyor.
    Fonksiyonun içine DBContext yollanıyor.
    Fonksiyonun içinde veritabanını oluşturarak bu DBContext objesini
    return etmeniz lazım.
*/
const path = require("path");
const ePost = require("./Entity/Post");

module.exports = (DBContext, GlobalVariables) => {

    let dbLocation = path.join(GlobalVariables.DIRS.Development, "database.db");
    
    const DB = new DBContext(dbLocation);
    DB.Connect();

    DB.SetModel(ePost.ModelName, ePost.Model);
    DB.Sync();

    return DB;
}
