const express = require('express')
const router = express.Router();

const { DataTypes } = require('sequelize');
const db = require('../database/db.config');
const pokemonModel = require('../models/pokemon');
const Pokemon = pokemonModel(db, DataTypes)

const auth = require('../auth')

//Créers les route
router.get('', auth, async (req, res) => {
    try {
        if (req.query.name) {
            const pokemons = await Pokemon.findAll({ where: { name: req.query.name } })
            if (!pokemons) return res.status(404).send('Aucun pokémon trouvé')
            const message = `Il y'a ${pokemons.length} pokemons qui correspondent au terme de recherche ${req.query.name}`
            console.log(pokemons)
            res.json({ message, data: pokemons })
            return
        }
        const pokemons = await Pokemon.findAll()
        if (!pokemons) return res.status(404).send('Aucun pokémon trouvé')
        const message = "La liste des pokemons a bien été récupérée"
        res.json({ message, data: pokemons })
    } catch (error) {
        console.error(error)
        res.status(500).send('Erreur lors de la récupération des pokémons', error)
    }

})

router.get('/:id', async (req, res) => {
    try {
        const pokemon = await Pokemon.findByPk(req.params.id);//Pas besion de converture une chaine de caractére en number
        if (!pokemon) return res.status(404).send('Pokémon non trouvé')
        message = "Un pokemon trouvé"
        res.json({ message, data: pokemon })
    } catch (error) {
        console.error(error)
        res.status(500).send('Erreur serveur', error)
    }
})

router.post('/', async (req, res) => {
    try {
        //Vérification tous les champs sont obligatores
        if (!req.body.name || !req.body.hp || !req.body.cp || !req.body.picture || !req.body.types) {
            return res.status(400).send('Tous les champs sont obligatoires')
        }
        const newPokemon = await Pokemon.create({ ...req.body, types: req.body.types.join() });//Atention de type de donnée envoyer a la base de donnée format envoyer Array mais sting en DB
        console.log("hp", typeof (req.body.hp))
        res.status(201).json({ message: 'Pokémon créé avec succès', data: newPokemon })
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            return res.status(400).json({ message: "Erreur de validation des données", errors: error.errors })
        }
        if (error.name === "UniqueConstraintError") {
            return res.status(400).json({ errors: "Nom unique" })
        }
        res.status(500).json({ erreur: error })
    }
})

router.put('/:id', async (req, res) => {
    try {
        //Vérification tous les champs sont obligatoires
        if (!req.body.name || !req.body.hp || !req.body.cp || !req.body.picture || !req.body.types) {
            return res.status(400).send('Tous les champs sont obligatoires')
        }
        const tabId = await Pokemon.update({ ...req.body, types: req.body.types.join() }, { where: { id: req.params.id } });
        if (tabId[0] === 0) return res.status(404).send('Pokémon non trouvé'); //return  un tableau [0] ou [1] ou [2] ...
        const pokemon = await Pokemon.findByPk(tabId[0])
        if (!pokemon) return res.status(404).send('Pokemon non trouvé')
        res.json({ message: 'Pokémon mis à jour avec succès', data: pokemon })
    }
    catch (error) {
        if (error.name === "SequelizeValidationError") {
            return res.status(400).json({ message: "Erreur de validation des données", errors: error.errors })
        }
        if (error.name === "UniqueConstraintError") {
            return res.status(400).json({ errors: error.errors })
        }
        res.status(500).send('Erreur Serveur')
    }

})

router.delete('/:id', async (req, res) => {
    try {
        const pokemon = await Pokemon.findByPk(req.params.id);
        if (!pokemon) return res.status(404).send('Pokémon non trouvé'); //return  un tableau [0] ou [1] ou [2]...
        //Suppression en BDD        
        const tabId = await Pokemon.destroy({ where: { id: req.params.id } });
        console.log(tabId)
        if (tabId === 0) return res.status(404).send('Pokémon non trouvé');
        res.json({ message: 'Pokémon supprimé avec succès', data: pokemon })
    } catch (error) {
        console.error(error)
        res.status(500).send('Erreur Serveur')
    }

})






module.exports = router

