const swaggerAutogen = require('swagger-autogen')
const outputFile = './swagger-output.json'
const endpointsFiles = ['./taskList.js']
const config = {
  info: {
    title: 'Task List API',
    description: 'API for a Task List to manage my daily obsticles '
  },
  host: 'localhost:3004',
  securityDefinitions: {
    api_key: {
      type: 'apiKey',
      name: 'api-key',
      in: 'header'
    }
  },
  schemes: ['http'],
  definitions: {
    'server side error': {
      $status: 'ERROR',
      $msg: 'some error message',
      error: {
        $message: 'Error message caught',
        $name: 'Error name',
        stack: 'Error stack'
      }
    },
    tasks: {
        $id: "1",
        $title: "Just an example",
        $creationDate: "2023-06-15",
        $completionDate: "2023-06-21",
      },
    
    
  }
}
swaggerAutogen(outputFile, endpointsFiles, config).then(async () => {
  await import('./taskList.js') // Your express api project's root file where the server starts
})