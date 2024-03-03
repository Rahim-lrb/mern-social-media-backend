const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  image: {
    type: String, 
    default: "https://res.cloudinary.com/dauwoapmc/image/upload/v1709382251/important/user.png"
  },
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  age: {
    type: String,
    default: '0'
  },
  location: {
    type: String,
    default: 'Not specified'
  },
  bio: {
    type: String,
    default: 'An artist of considerable range, Ryan — the name taken by Melbourne-raised, Brooklyn-based Nick Murphy — writes, performs and records all of his own music, giving it a warm, intimate feel with a solid groove structure. An artist of considerable range.'
  },
  job: {
    type: String,
    default: 'Not specified'
    // Solution Manager - Creative Tim Officer
  }
})

// static signup method
userSchema.statics.signup = async function(name, email, password, image) {
  console.log("information is received in the static method")
  // validation
  if (!name || !email || !password) {
    throw Error('All fields must be filled')
  }
  if (!validator.isEmail(email)) {
    throw Error('Email not valid')
  }
  if (!validator.isStrongPassword(password)) {
    throw Error('Password not strong enough')
  }

  const exists = await this.findOne({ email })

  if (exists) {
    throw Error('Email already in use')
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)
  const user = await this.create({name, email, password: hash, image })
  return user
}

// static login method
userSchema.statics.login = async function(email, password) {

  if (!email || !password) {
    throw Error('All fields must be filled')
  }
  const user = await this.findOne({ email })
  if (!user) {
    throw Error('Incorrect email')
  }

  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    throw Error('Incorrect password')
  }
  return user
}

module.exports = mongoose.model('User', userSchema)