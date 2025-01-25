// Importation du module HTTP natif de Node.js
const http = require('http');

// Importation de l'application Express depuis le fichier "app.js"
const app = require('./app');

// Configuration du port sur lequel le serveur va écouter
// Si une variable d'environnement PORT est définie, elle sera utilisée, sinon, le port par défaut sera 3000
app.set('port', process.env.PORT || 3000);

// Création du serveur HTTP en utilisant l'application Express
const server = http.createServer(app);

// Démarrage du serveur, qui écoute sur le port défini (3000 par défaut ou celui spécifié dans la variable d'environnement)
server.listen(process.env.PORT || 3000);


