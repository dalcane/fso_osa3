require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const { response, request } = require('express')
const mongoose = require('mongoose')
const Person = require('./models/person')
const app = express()

morgan.token('nameNumber', function getId(res) {
  return JSON.stringify(res.body)
})

app.use(morgan(':method :url :response-time :nameNumber'))
app.use(express.json())
app.use(express.static('build'))
app.use(cors())

app.get('/api/info', (req, res) => {
  Person.find({})
    .then(people => {
      res.json('The phonebook has '+ people.length +' people in it. The date is: ' + new Date())
    })
})

app.get('/index.html', (req, res) => {
  res.send('<h1>This is a phonebook for FSO Part3.</h1>')
})

app.get('/api/persons', (req, res) => {
  Person.find({})
    .then(people => {
      res.json(people)
    })
})

app.get('/api/persons/:id', (request, response,next) => {
  Person.findById(request.params.id)
    .then(note => {
      if(note){
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const person = new Person({
    name: body.content,
    number: body.number,
    date: new Date(),
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.content,
    number: body.number,
  }

  Person.findByIdAndUpdate(
    request.params.id,
    person, { new: true, runValidators:true, context:'query' })
    .then(updatePerson => {
      response.json(updatePerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id,
    { runValidators:true })
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

// eslint-disable-next-line no-undef
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})