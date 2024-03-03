const ErrorResponse = require("../utils/errorResponse");


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