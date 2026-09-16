const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();
const helmet = require("helmet");
const morgan = require("morgan");
const fs = require("node:fs");
const rateLimit = require("express-rate-limit");
const { log } = require("node:console");
const port = 5000;
//Connection à la DB
connectDB();

const app = express();

//Middleware
//Log
// app.use((req, res, next) => {
//   log("Request éffectuer : " + String(new Date()).toString());
//   log("\n");
//   next();
// });

// Utiliser Morgan pour écrire les logs
// Définir un style de journalisation
// const logger = morgan("combined");
//app.use(logger); Pour afficher les log directement dans la console
// Configurer Morgan pour utiliser le format 'combined' et stocker les logs dans un fichier
const accessLogStream = fs.createWriteStream("./logs/access.log", {
  flags: "a",
});

app.use(morgan("combined", { stream: accessLogStream }));

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
// Configurer helmet
app.use(helmet());
// Configuration du rate limiter (limite à 10 requêtes par utilisateur par heure)
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // Durée de la fenêtre en millisecondes
  max: 5, // Limite maximale du nombre de requêtes dans la fenêtre^
  message: "Veillez réesseiller lus tart",
});

//Route
app.use("/post", limiter, require("./routes/post.routes"));
app.use("/users", limiter, require("./routes/user.routes"));

//Lancer le server
app.listen(port, () =>
  console.log(
    `Le server a demarré au port ${port} \n http://localhost:${port}/`,
  ),
);
app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res
    .status(200)
    .send(
      `<p>Serveur en cours <a href="http://localhost:5000/post">http://localhost:5000/post</a></p>` +
        `<p>Serveur en cours <a href="http://localhost:5000/users">http://localhost:5000/users</a></p>`,
    );
});
