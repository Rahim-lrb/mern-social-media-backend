/*
! instead of try catch every time
using async await in express js website
*/ 
const asyncHandler = fn => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next)

module.exports = asyncHandler;



/*
const getBootcampRoute = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
      return res.status(404).json({ success: false, error: 'Bootcamp not found' });
    }

    res.status(200).json({ success: true, data: bootcamp });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};


const getBootcampRoute = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return res.status(404).json({ success: false, error: 'Bootcamp not found' });
  }

  res.status(200).json({ success: true, data: bootcamp });
});
*/ 