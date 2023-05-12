const { DataTypes } = require("sequelize")

module.exports = {
    ModelName : "Post",
    Model : {
        ID : {
            type : DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Title : {
            type : DataTypes.STRING,
            allowNull : false
        },
        Text : {
            type : DataTypes.TEXT
        },
        IsPublished : {
            type : DataTypes.BOOLEAN,
            allowNull : false,
            defaultValue : true
        }
    }
}