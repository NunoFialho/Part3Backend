const express = require('express')
const app = express()
const cors = require('cors')
var morgan = require('morgan')
app.use(express.json())
app.use(cors())

morgan.token('person', (request, response) => {
  return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms  :person'))
let persons = [
    {
      "name": "Novo",
      "number": "122",
      "id": 1
    },
    {
      "name": "teste",
      "number": 0,
      "id": 2
    },
    {
      "name": "aa",
      "number": 0,
      "id": 3
    },
    {
      "name": "asd",
      "number": 0,
      "id": 4
    }
  ]

  app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })

  app.get('/api/persons', (request,response) =>{
      response.json(persons)
  })

  app.get('/api/persons/:id',(request,response)=>{
    const id = Number(request.params.id)
    const person = persons.find(persona => persona.id===id)
    if(person){
        response.json(person)
    }else{
        response.sendStatus(404).end()
    }
    
  })

  app.get('/info',(request,response)=>{
      let d = Date()
      response.send('<p> Phonebook has info for '+persons.length+' people</p>'+'<p> '+d+'</p>')
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.sendStatus(204).end()
  }) 


  app.post('/api/persons', (request, response)=>{
    const body = request.body
    if (!body) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }

    if(persons.some(pers => pers.name===body.name)){
      return response.status(400).json({ 
        error: 'name already exists' 
      })
    }

    if(body.name==""|| body.number==""){
      return response.status(400).json({
        error: 'Must provide name and number'
      })
    }

    const person = {
      name: body.name,
      number: body.number,
      id: generateId()
    }
  
    persons = persons.concat(person)
    console.log(persons)

  response.json(persons)
  })


  const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId + 1
  }

  const PORT = process.env.PORT || 3001
  app.listen(PORT, ()=>{
      console.log('Server running on port '+PORT)
  })