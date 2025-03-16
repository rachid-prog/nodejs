//Importer les modules:
const express = require('express'), app = express(), favicon = require('serve-favicon')
const { DataTypes } = require('sequelize');
const db = require('./src/database/db.config');

const pokemonModel = require('./src/models/pokemon')
const Pokemon = pokemonModel(db, DataTypes)

const pokemon_router = require('./src/routes/pokemons')
const user_router = require('./src/routes/users')

const cors = require('cors')

// CORS

app.use(cors({
    //Par défaut:
    // origin: '*',
    // methods: 'GET, POST, PUT, DELETE',
    // "preflightContinue": false,
    // allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    // "optionsSuccessStatus": 204
}))

// Middleware
app.use(express.json()).use(express.urlencoded({ extended: true })).use(favicon(__dirname + '/favicon.ico'))
app.use((req, res, next) => { console.log(Date.now()); next() })


db.authenticate()
    .then(() => { console.log('☻☻ La connexion à la base de données a bien été établie. ☻☻') })
    .then(() => app.listen(process.env.PORT || 3002, _ => console.log(`☻☻ En écoute sur http://localhost:${process.env.PORT || 3002} ☻☻`)))
    .catch(err => { console.log(`Impossible de de connecter à la base de données ${err}`) })

//Les routes
app.use('/pokemons', pokemon_router)

app.use("/pokemons", user_router)

//Appel une route qui n'éxiste pas
app.use((req, res, next) => {
    res.status(404).json({ message: 'Page non trouvée' })
})

app.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur notre API Pokémon!' })
})