const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
    `mongodb+srv://fso2022:${password}@cluster0.u5yczv0.mongodb.net/phoneBook?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  date: Date,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: name,
  date: new Date(),
  number: number,
})

if (name===undefined) {
  Person.find({}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })
}else{
  person.save().then(result => {
    console.log(`${name} added to phonebook. Number: ${number}`)
    mongoose.connection.close()
  })
}





