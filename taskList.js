const express = require(`express`);
const session = require(`express-session`);
const app = express();
const port = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "supersecret",
    resave: false,
    saveUninitialized: true,
    cookie: {},
  })
);

const tasks = [ {
  title: "Recherche für Projekt",
  creationDate: "2023-06-14",
  completionDate: "2023-06-21"
},
{
  title: "Lebensmittel Einkaufen",
  creationDate: "2023-06-16",
  completionDate: "2023-06-18"
},
{
  title: "Trainieren für Wettkampf",
  creationDate: "2023-06-15",
  completionDate: "2023-06-24"
}
 ]