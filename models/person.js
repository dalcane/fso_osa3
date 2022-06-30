const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

function validator1 (val) {
  return /\d{2,3}-\d{5,6}/.test(val)
}

function validator2 (val) {
  return val.length===9
}

const vals2 = [
  { validator: validator1, msg: props => `${props.value} ei ole hyväksytty puhelinnumero!` }
  ,{ validator: validator2, msg: 'Oikea pituus on kahdeksan numeroa!' }
]

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    validate: vals2,
    required: [true, 'Numero vaaditaan!'],
  },
  date: Date,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    returnedObject.name =returnedObject.name.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)