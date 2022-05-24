const Tour = require('../models/tourModel');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

exports.alisaTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingAverage,summary,difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    // BUILD QUERY
    // 1A) Filtering
    // duration=5&difficulty=easy
    const queryObj = { ...req.query };
    const excudedFields = ['page', 'sort', 'limit', 'fields'];
    excudedFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced Filtering
    // duration[gte]=5&difficulty=easy&price[lt]=1200
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Tour.find(JSON.parse(queryStr));

    // 2) Sorting
    // sort=price,ratingsAverage (Ascending) for Descinding add "-" in front of the sorting field i.e sort=-price
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // 3) Field Limiting
    // fields=name,duration,price
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v'); // Excluding the __v field
    }

    // 4) Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    // page=2&limit=10, 1-10 page 1, 11-20 page 2, 21-30 page 3
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This page does not exist!');
    }

    // EXECUTE QUERY
    const tours = await query;

    // const tours = await Tour.find()
    //   .where('duraction')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    // SEND RESPONSE
    res.status(200).json({
      status: 'SUCCESS',
      totalCount: tours.length,
      data: { tours },
    });
  } catch (err) {
    res.status(404).json({
      status: 'FAILED',
      message: err.message,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;

    const tour = await Tour.findById(id);
    // Tour.findOne({_id: id})

    res.status(200).json({
      status: 'SUCCESS',
      data: { tour },
    });
  } catch (err) {
    res.status(404).json({
      status: 'FAILED',
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'SUCCESS',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'FAILED',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const {
      params: { id },
      body,
    } = req;

    const tour = await Tour.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'SUCCESS',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'FAILED',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;

    await Tour.findByIdAndDelete(id);

    res.status(204).json({
      status: 'SUCCESS',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'FAILED',
      message: err,
    });
  }
};
