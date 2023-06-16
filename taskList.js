const express = require('express')
const session = require('express-session')
const swagUI = require('swagger-ui-express')
const swagDoc = require('./swagger-output.json')
const app = express()
const port = 3004

app.use('/swagger', swagUI.serve, swagUI.setup(swagDoc))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
  session({
    secret: 'supersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {}
  })
)

const tasks = [
  {
    id: '1',
    title: 'Recherche für Projekt',
    creationDate: '2023-06-14',
    completionDate: '2023-06-21'
  },
  {
    id: '2',
    title: 'Lebensmittel Einkaufen',
    creationDate: '2023-06-16',
    completionDate: '2023-06-18'
  },
  {
    id: '3',
    title: 'Trainieren für Wettkampf',
    creationDate: '2023-06-15',
    completionDate: '2023-06-24'
  },
  {
    id: '4',
    title: 'ins Gym gehen',
    creationDate: '2023-06-15',
    completionDate: '2023-06-24'
  }
]
const accounts = [
  { mail: 'dave@gmail.com', pwd: 'm295' },
  { mail: 'justin@me.ch', pwd: 'm295' }
]
const falsePwdOrMail = {
  error: 'wrong Password or Email'
}
const notLoggedIn = {
  error: "you're logged out"
}
const mistake = {
  error: 'failed'
}
const succeded = {
  passed: 'It worked'
}
const notHere = {
  error: 'Not Found'
}
const verificationTrue = {
  passed: 'verified'
}
const login = {
  passed: "you're now logged in"
}
const pwd = 'm295'

app.post('/login', (request, response) => {
  const { mail } = request.body
  const defineMail = /^\S+@\S+\.\S+$/ // kopiert von chatgpt
  if (!mail || !defineMail.test(mail) || pwd !== accounts[0].pwd) {
    response.status(401).json(falsePwdOrMail)
  }
  const account = accounts.find((account) => account.mail === mail)
  if (!account) {
    return response.status(401).json(notHere)
  }
  request.session.mail = mail
  response.status(200).json(login)
})

app.get('/verify', (request, response) => {
  /*
 #swagger.tags = ["verify"]
 #swagger.summary = 'verify'
 #swagger.description = 'verify your account'
 #swagger.responses[200] = {description: "verified", schema:{$ref: "#/definitions/tasks"}}
 #swagger.responses[401] = {description: "failed"}
*/
  if (!request.session.pwd) {
    return response.status(401).json(mistake)
  }
  response.status(200).json(verificationTrue)
})

app.delete('/logout', (request, response) => {
  /*
 #swagger.tags = ["logout"]
 #swagger.summary = 'logout'
 #swagger.description = 'logout of the account'
 #swagger.responses[204] = {description: "logged out", schema:{$ref: "#/definitions/tasks"}}
*/
  request.session.destroy()
  response.status(204).json(notLoggedIn)
})

app.get('/tasks', (request, response) => {
  /*
 #swagger.tags = ["tasks"]
 #swagger.summary = 'Get tasks'
 #swagger.description = 'Get all tasks'
 #swagger.responses[200] = {description: "Showed", schema:{$ref: "#/definitions/tasks"}}
*/
  if (!request.session.mail) {
    response.status(403).json(notLoggedIn)
  } else {
    response.status(200).json(tasks)
  }
})

app.post('/tasks', (request, response) => {
  /*
 #swagger.tags = ["tasks"]
 #swagger.summary = 'Create a task'
 #swagger.description = 'Creata a new task'
 #swagger.responses[201] = {description: "Created", schema:{$ref: "#/definitions/tasks"}}
*/
  const createNewTask = request.body
  if (!request.session.mail) {
    response.status(403).json(notLoggedIn)
  } else {
    tasks.push(createNewTask)
    response.status(201).json(tasks)
  }
})

app.get('/tasks/:id', (request, response) => {
/*
 #swagger.tags = ["tasks"]
 #swagger.summary = 'Get a task'
 #swagger.description = 'Get a task by its ID'
 #swagger.responses[204] = {description: "Show data", schema:{$ref: "#/definitions/tasks"}}
 #swagger.responses[404] = {description: "task not found"}
*/
  const id = parseInt(request.params.id)
  const index = tasks.findIndex((tas) => tas.id === id)

  if (!request.session.mail) {
    response.status(403).json(notLoggedIn)
  } else {
    if (index) {
      response.status(200).json(tasks[id - 1])
    } else {
      response.status(404).json(notHere)
    }
  }
})

app.put('/tasks/:id', (request, response) => {
  /*
 #swagger.tags = ["tasks"]
 #swagger.summary = 'Edit a task'
 #swagger.description = 'Edit a task by its ID'
 #swagger.responses[200] = {description: "Edited", schema:{$ref: "#/definitions/tasks"}}
 #swagger.responses[404] = {description: "task not found"}
*/
  const taskId = request.params.id
  if (!request.session.mail) {
    response.status(403).json(notLoggedIn)
  } else {
    if (tasks[taskId]) {
      tasks[taskId] = {
        ...tasks[taskId],
        ...request.body
      }
      response.status(200).json(tasks[taskId])
    } else {
      response.sendStatus(404).json(notHere)
    }
  }
})
app.delete('/tasks/:id', (request, response) => {
  /*
 #swagger.tags = ["tasks"]
 #swagger.summary = 'Delete a task'
 #swagger.description = 'Delete a task by its ID'
 #swagger.responses[200] = {description: "Deleted", schema:{$ref: "#/definitions/tasks"}}
 #swagger.responses[404] = {description: "task not found"}
*/
  const taskId = request.params.id
  const index = tasks.findIndex((t) => t.id === taskId)
  if (!request.session.mail) {
    response.status(403).json(mistake)
  } else {
    if (index !== -1) {
      tasks.splice(index, 1)
      response.status(200).json(succeded)
    } else {
      response.status(404).json(notHere)
    }
  }
})

app.listen(port, () => {
  console.log(`${port} is connected`)
})
