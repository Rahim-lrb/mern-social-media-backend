const { populate } = require("dotenv");

// a middleware to control the pagination select pages...etc
const advancedResult = (model, populate) => async (req, res, next) => {
    let query;
    // . ?select=name
    const reqQuery = { ...req.query } 
    let removeFields = [ "select", "sort", "limit", "page"]
    removeFields.forEach(param => delete reqQuery[param] )
    // . filtering, things like ?averageCose: bootcamps?averageCost[lte]=10000
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
    query = model.find(JSON.parse(queryStr)) 

    // select fields => name,description,housing => name description housing
    if (req.query.select) {
        const fields = req.query.select.split(",").join(" ")
        query = query.select(fields)
    }
    // sort field
    if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ")
        query = query.sort(sortBy)
    } else { // sorted descending using createdAT
        query = query.sort("-createdAt")
    }

    // ! pagination
    const page = parseInt(req.query.page, 10 || 1) // to turn it to 
    const limit = parseInt(req.query.limit, 10 || 25); // how many docs does the page contain if 1 then page 2 to see the others
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit
    const total = await model.countDocuments()

    query.skip(startIndex).limit(limit)
    // . in case he passes something to populate
    if (populate) {
        query.populate(populate)
    }
    // executing the query
    const results = await query;

    // pagination result 
    const pagination = {}
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    res.advancedResult = {
        success: true,
        count: results.length,
        data: results
    }
    next()
}

module.exports = advancedResult;