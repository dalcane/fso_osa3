const express = require('express')
const morgan = require('morgan')
const cors = require('cors')


const app = express()
app.use(morgan('tiny'))
app.use(express.json())
app.use(cors())

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
    }
    ]

const length = "The Phonebook has info for " + persons.length + " people." + "Today's date is " + new Date()

app.get('/api/info', (req, res) => {
    res.json(length)
})


app.get('/', (req, res) => {
    res.send('<h1>This is a phonebook for FSO Part3</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if(person){
        response.json(person)
    } else {
        response.status(404).end()
    }
})

const randInt = () => {
    return Math.floor(Math.random() * 10000000)
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    const personName = body.content

    if (!body.content || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

    if (persons.find(person => person.name === personName)){
        return response.status(400).json({
            error: 'name already on list'
        })
    }

    const person = {
        name: body.content,
        number: body.number,
        date: new Date(),
        id: randInt(),
    }

    persons = persons.concat(person)

    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})