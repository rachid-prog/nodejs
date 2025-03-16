const express = require('express');
const router = express.Router();

const userModel = require('../models/user');
const db = require('../database/db.config');
const { DataTypes } = require('sequelize');
const User = userModel(db, DataTypes)
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken')

router.post('/login', async (req, res) => {
    //Vérifier tous champs sont obligatoire
    if (!req.body.username || !req.body.password) { return res.status(400).send('Tous les champs sont obligatoires') }
    try {
        const user = await User.findOne({ where: { username: req.body.username } });
        if (!user) return res.status(401).send('Utilisateur non trouvé ou mot de passe incorrect')
        //Comparer mot de passe
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(401).send('Utilisateur non trouvé ou mot de passe incorrect')
        //Créer un token
        const token = jwt.sign({ userId: user.id }, process.env.PRIVATE_KEY, { expiresIn: '24h' })
        res.json({ message: 'Authentification réussie', user, token })

    }
    catch (error) {
        console.error(error)
        res.status(500).send('Erreur interne du serveur, Réessayez dans quelques instants')
    }
})

module.exports = router