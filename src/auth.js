const jwt = require('jsonwebtoken');

//***Vérification de présence du token */

module.exports = (req, res, next) => {
    // Récupération du token dans l'en-tête Authorization
    const authorizationHeader = req.headers.authorization
    if (!authorizationHeader) return res.status(401).send('Aucun token fourni');
    const token = authorizationHeader.split(' ')[1];
    // Vérification du token
    jwt.verify(token, process.env.PRIVATE_KEY, (err, decodedToken) => {
        if (err) return res.status(401).send('Token invalide');
        next()

    })

};