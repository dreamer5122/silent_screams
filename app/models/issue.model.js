module.exports = (sequelize, DataTypes) => {
    const Issue = sequelize.define("issue", {
      issue: {
        type: DataTypes.TEXT
      },
      status: {
        type: DataTypes.INTEGER
      }
    });
  
    return Issue;
  };