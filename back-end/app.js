// Importation du module Express
const express = require('express');

// Création d'une application Express
const app = express();

//Importation de mongoose
const mongoose = require ('mongoose');

// Importation du modèle Mongoose "Thing"
const Thing = require('./models/thing');

mongoose.connect('mongodb+srv://samehbouzbida:samehb@cluster1.6sgxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


// Middleware pour analyser les corps des requêtes entrantes au format JSON
app.use(express.json());



// Middleware pour la configuration des en-têtes HTTP liés à CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
  // Permet à toutes les origines d'accéder aux ressources du serveur
  // L'astérisque (*) signifie que toutes les origines sont autorisées
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // Définit les en-têtes HTTP autorisés pour les requêtes vers ce serveur
  // Cela inclut les en-têtes spécifiques comme Authorization et Content-Type
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  
  // Définit les méthodes HTTP autorisées pour les requêtes
  // Cela inclut les méthodes standards comme GET, POST, PUT, DELETE, PATCH et OPTIONS
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  
  // Passe le contrôle au middleware suivant
  next();
});






// Route POST pour créer un nouvel objet dans la base de données
app.post('/api/stuff', (req, res, next) => {
  // Suppression de l'éventuel champ "_id" de la requête
  // Cela garantit que MongoDB génère automatiquement un nouvel "_id" unique
  delete req.body._id;

  // Création d'une nouvelle instance du modèle "Thing"
  // Les données de la requête sont réparties dans l'objet grâce à l'opérateur spread ("...")
  const thing = new Thing({
    ...req.body
  });

  // Sauvegarde de l'objet dans la base de données
  thing.save()
    .then(() => 
      // Réponse HTTP 201 (Created) en cas de succès
      res.status(201).json({ message: 'Objet enregistré !' })
    )
    .catch(error => 
      // Réponse HTTP 400 (Bad Request) en cas d'erreur
      res.status(400).json({ error })
    );
});



// Route PUT pour mettre à jour un objet spécifique identifié par son ID
app.put('/api/stuff/:id', (req, res, next) => {
  // Utilisation de Mongoose pour mettre à jour un document dans la collection
  Thing.updateOne(
    { _id: req.params.id }, // Filtre : trouver l'objet avec l'identifiant fourni
    { ...req.body, _id: req.params.id } // Mise à jour : utiliser les données du corps de la requête, tout en conservant l'ID inchangé
  )
    .then(() => 
      // Si la mise à jour réussit, envoyer une réponse avec le statut HTTP 200 (OK) et un message de confirmation
      res.status(200).json({ message: 'Objet modifié !' })
    )
    .catch(error => 
      // Si une erreur survient, envoyer une réponse avec le statut HTTP 400 (Bad Request) et l'objet d'erreur
      res.status(400).json({ error })
    );
});


app.delete('/api/stuff/:id', (req, res, next) => {
  Thing.deleteOne({ _id: req.params.id }) // Utilise Mongoose pour supprimer un objet spécifique
    .then(() => 
      // Si la suppression réussit, retourne une réponse avec le statut HTTP 200 (OK) et un message de confirmation
      res.status(200).json({ message: 'Objet supprimé !' })
    )
    .catch(error => 
      // Si une erreur survient, retourne une réponse avec le statut HTTP 400 (Bad Request) et l'objet d'erreur
      res.status(400).json({ error })
    );
});


// Route GET pour récupérer un objet spécifique à partir de son identifiant unique (_id)
app.get('/api/stuff/:id', (req, res, next) => {
  // Utilisation de Mongoose pour trouver un objet dans la collection en fonction de l'identifiant fourni
  Thing.findOne({ _id: req.params.id })
    .then(thing => 
      // Si l'objet est trouvé, retourner une réponse avec le statut HTTP 200 (OK) et l'objet en format JSON
      res.status(200).json(thing)
    )
    .catch(error => 
      // Si une erreur survient (par exemple, si l'objet n'existe pas), retourner une réponse avec le statut HTTP 404 (Not Found)
      // et l'objet d'erreur en format JSON
      res.status(404).json({ error })
    );
});



// Middleware pour gérer les requêtes GET vers '/api/stuff'
app.get('/api/stuff', (req, res, next) => {
  // Utilisation du modèle Mongoose "Thing" pour interroger la base de données
  Thing.find()
    .then(things => 
      // En cas de succès, renvoyer un tableau JSON contenant tous les objets trouvés
      res.status(200).json(things)
    )
    .catch(error => 
      // En cas d'erreur, renvoyer une réponse avec un statut HTTP 400 (Bad Request)
      // et l'objet d'erreur en format JSON
      res.status(400).json({ error })
    );
});







// Exportation de l'application Express pour l'utiliser dans un autre fichier
module.exports = app;
