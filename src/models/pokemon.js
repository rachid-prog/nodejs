/* L’API Rest et la Base de données : Créer un modèle Sequelize */
const validTypes = ['Plante', "Poison", "Feu", "Eau", "Insecte", "Vol", "Normal",
    "Electrik", "Fée"]
module.exports = (db, DataTypes) => {
    return db.define('Pokemon', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: { msg: "Le nom est déjas pris" },
            validate: {
                notEmpty: true,
                notNull: true,
            }

        },
        hp: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true,
                notNull: true,
                min: {
                    args: [0],
                    msg: "L'HP doit être supérieur ou égal à 0."
                },
                max: {
                    args: [99],
                    msg: "L'HP doit être inférieur ou égal à 99."
                }
            }

        },
        cp: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true,
                notNull: true,
                min: {
                    args: [0],
                    msg: "Le CP doit être supérieur ou égal à 0."
                },
                max: {
                    args: [99],
                    msg: "Le CP doit être inférieur ou égal à 99."
                }
            }

        },
        picture: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isUrl: true,
                notNull: true,
            }

        },
        types: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isTypeValid(value) { //valeur de la base de donnée en chaine de caractére
                    if (!value) throw new Error('Un pokemon doit au moins avoir un type.')
                    if (value.split(',').length > 3) throw new Error('Un pokemon ne peux pas avoir plus de trois types')
                    value.split(',').forEach(type => {
                        if (!validTypes.includes(type)) throw new Error(`Un type de pokemon est invalide: ${validTypes}`)
                    });
                }
            }
        },


    })
}