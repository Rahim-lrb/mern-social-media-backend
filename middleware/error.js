const ErrorResponse = require("../utils/errorResponse");

/*
! custom error middleware to ease handling errors 
* 1 catch(err) res.json({err}) 
not flexible at all

* 2 catch(err) next(err)
returns 500 status code by def, and renders the error as an html

* 3 to return a json data instead of html
function errorHandler(err, req, res, next) {
    res.status(500).json({ success: false, error: err.message  })
}
app.use(errorHandler)
note: pass it after the routes so the error is ready 

* 4 create a customError class to extend the core error class
class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

we added a statusCode property to the err class

function errorHandler(err, req, res, next) {
    res.status(err.statuscode || 500 ).json({ success: false, error: err.message  })
}

we use it now instead of next(err) => next(new ErrorResponse("invalid password", 401);)

* 5 errorHandling we catch specific errors in our error handler, so basically we are handling the errors with the same name

function errorHandler(err, req, res, next) {
    let error = {...err} => we clone it so not mess the original one
    error.message = err.message;


    if (err.name == "castError") {
        error = new ErrorResponse("bootcamp not found", 404)
    }


    res.status(error.statuscode || 500 ).json({ success: false, error: error.message  })
}

next(err): would be enough in that case, no need for specifying a message
*/ 
function errorHandling(err, req, res, next) {
    // res.status(500).json({ success: false, error: err.message })

    let error = {...err}
    error.message = err.message;

    // mongoose bad objectID
    if (err.name == "CastError") {
        const message = `bootcamp not found with id of ${err.value}`;
        error = new ErrorResponse(message, 404)
    }
    // mongoose duplicate key
    if (err.name == "duplicate key") {
        const message = `duplicate field value entered`;
        error = new ErrorResponse(message, 400)
    }
    //  mongoose validation error
    if (err.name == "ValidationError") {
        const message = Object.values(err.errors).map(val => val.message)
        error = new ErrorResponse(message, 400)
    }
    // res.status(err.statusCode || 500 ).json({ success: false, error: err.message || "server error" })
    // we cloned error from err, so same 
    res.status(error.statusCode || 500 ).json({
        success: false,
        error: error.message || "server error"
    })
}

module.exports = errorHandling;