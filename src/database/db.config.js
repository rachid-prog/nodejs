const { Sequelize, DataTypes } = require('sequelize');
const pokemons = require("../../mock-pokemon")
const bcrypt = require("bcrypt")
let db;
if (process.env.NODE_ENV === 'production') {
    db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.PASSWORD, {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        logging: true,
    })

}
else {
    db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.PASSWORD, {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        logging: false,
    })

}
//Connexion à la base de donnée mysql avec sequelize


//importer les tables
const pokemonModel = require('../models/pokemon');
const Pokemon = pokemonModel(db, DataTypes)

const userModel = require('../models/user')
const User = userModel(db, DataTypes)
//Syncroniser les tables avec la base de donnée
db.sync({ force: true })
    .then(() => {
        console.log('Base de données "pokedex" synchronisée avec succès!')
        // Créer des  pokemons dans pokedex
        pokemons.forEach(pokemon => {
            Pokemon.create({
                name: pokemon.name,
                hp: pokemon.hp,
                cp: pokemon.cp,
                picture: pokemon.picture,
                types: pokemon.types.join(),
            })
                .then(pokemon => console.log(`Le pokémon ${pokemon.name} a été créé avec succès!`))
                .catch(error => console.error(`Erreur lors de la création du pokémon ${pokemon.name}:`, error))
        })
        // Créer un utilisateur de test
        bcrypt.hash('1234', 10)
            .then(hash => {
                User.create({
                    username: 'alex',
                    password: hash,
                })
                    .then(user => console.log(`L'utilisateur  a été créé avec succès!`))
                    .catch(error => console.error(`Erreur lors de la création de l'utilisateur `, error))
            })

    })
    .catch((err) => console.error('Erreur lors de la synchronisation:', err));


module.exports = db;

