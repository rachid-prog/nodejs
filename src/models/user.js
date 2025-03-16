/* Authentification : Créer un modèle User avec Sequelize */
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: { msg: "Le nom d'utilisateur est déjà utilisé" },

        },
        password: {
            type: DataTypes.STRING
        }
    })
}

