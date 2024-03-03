/*
! npm i express mongoose dotenv bcrypt jsonwebtoken cors cookie-parser express-fileupload
! hpp xss-clean helmet express-rate-limit express-mongo-sanitize 
*/ 
require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require("cors");
const cookieParser = require("cookie-parser")
const fileupload = require('express-fileupload');

const errorHandling = require("./middleware/error")

// security
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const morgan = require("morgan")

const authRouter = require('./routes/auth')
const userRouter = require('./routes/user')
const postRouter = require('./routes/post');

const { forgetPassword, resetPassword } = require("./controllers/authController")
const { protect, authorize } = require("./middleware/protect")





const app = express()



// * middlewares
app.use(express.json());
app.use((req, res, next) => { console.log(req.path, req.method); next()})
app.use(cors({ origin: true, credentials: true }))
app.use(cookieParser()); // enable using cookies

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
// security
app.use(mongoSanitize());
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100
});
app.use(limiter); // Rate limiting
app.use(helmet()); // Set security headers
app.use(hpp()); // Prevent http param pollution
app.use(xss()); // Prevent XSS attacks






// routes usage
app.get('/', (req, res) => {
    res.send("welcome to wex social media backend")
})
app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/posts', postRouter)
// app.use('/api/comments', commentRouter)
// app.use('/api/likes', likeRouter)



app.use(errorHandling)




mongoose.set("strictQuery", true)
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("db is connected")
})
.catch((error) => {
    console.log("db is not connected" + error)
})


app.listen(process.env.PORT || 5000, () => {
    console.log(`server is listening on port ${process.env.PORT} in ${process.env.NODE_ENV}`)
})