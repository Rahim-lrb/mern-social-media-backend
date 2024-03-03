// ! node seeder -i or -d

const fs = require("fs");
const mongoose = require("mongoose");
require("dotenv").config()

// load models
const Bootcamp = require("./models/Bootcamp")
const Course = require("./models/Course")
const User = require("./models/User")

mongoose.connect(process.env.DB_STRING)
.then(() => {
    console.log("db is connected")
})
.catch((err) => {
    console.log(err)
})

// read json files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'))
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'))
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'))

async function importIntoDb() {
    try {
        await Bootcamp.create(bootcamps)
        await Course.create(courses)
        await User.create(users)
        console.log("data is imported")
        process.exit(); // Add this line to exit the process
    }
    catch (err) {
        console.log(err)
    }
}

// delete data
async function deleteData() {
    try {
        await Bootcamp.deleteMany()
        await Course.deleteMany()
        await User.deleteMany()
        console.log("data is destroyed")
        process.exit(); // Add this line to exit the process
    }
    catch (err) {
        console.log("there is an error" + err)
    }
}

if (process.argv[2] == "-i") { // node seeder -i
    importIntoDb()
} else if (process.argv[2] == '-d'){
    deleteData()
}
