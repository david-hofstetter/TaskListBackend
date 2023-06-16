const express = require(`express`);
const session = require(`express-session`);
const app = express();
const port = 3003;

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

const tasks = [
  {
    id: "1",
    title: "Recherche für Projekt",
    creationDate: "2023-06-14",
    completionDate: "2023-06-21",
  },
  {
    id: "2",
    title: "Lebensmittel Einkaufen",
    creationDate: "2023-06-16",
    completionDate: "2023-06-18",
  },
  {
    id: "3",
    title: "Trainieren für Wettkampf",
    creationDate: "2023-06-15",
    completionDate: "2023-06-24",
  },
  {
    id: "4",
    title: "ins Gym gehen",
    creationDate: "2023-06-15",
    completionDate: "2023-06-24",
  },
];
const accounts = [
  { email: "dave@gmail", password: "1234" },
  { email: "justin@me.ch", password: "abc" },
];

app.get(`/tasks`, (request, response) => {
  response.status(200).json(tasks);
});

app.post(`/tasks`, (request, response) => {
  const createNewTask = request.body;
  tasks.push(createNewTask);
  response.json(tasks);
});

app.get(`/tasks/:id`, (request, response) => {
  const taskId = parseInt(request.params.id);
  if (tasks) {
    response.status(200).json(tasks[taskId - 1]);
  } else {
    response.status(404).send("Task not Found");
  }
});

app.put(`/tasks/:id`, (request, response) => {
  const taskId = parseInt(request.params.id);
  const index = tasks.findIndex((t) => t.id === taskId);
  const updatedTask = request.body;
  const task = tasks[index];

  tasks.push(updatedTask);
  //const existingTask = tasks.find(task => task.id === taskId);
  if (!task) {
    response.status(404).send("Task does not exist");
  } else {
    response.status(200).json(task);
  }
});
app.delete("/tasks/:id", (request, response) => {
  const taskId = request.params.id;
  const index = tasks.findIndex((t) => t.id === taskId)
  if (index !== -1) {
    tasks.splice(index, 1)
    response.status(204).send("DELETED")
  } else {
    response.status(404).send("Task does not exist")
  }
});
const mail = "dave@gmail.com"
const pwd = "1234"

app.post("/login", (request, response) => {
    //const mail = parseInt(request.params.email)
    //const pwd = parseInt(request.params.password)
    //nochmal überarbeiten
    if (request.body.mail !== mail || request.body.pwd !== pwd) {
      return response.status(401).send("Email or password incorrect")
    }
    request.session.mail = request.body.mail
    response.status(201).send("Your logged in")
  });

  app.get("/verify", (request, response) => {
    if (!request.session.mail) {
      return response.status(401).send("failed");
    }
    response.status(200).send("verified");
  });
  
  app.delete("/logout", (request, response) => {
    request.session.destroy();
    response.status(200).send("Logged out!");
  });



app.listen(port, () => {
  console.log(`${port} is connected SUCCESFULLY`)
});
