/* eslint-disable node/no-unsupported-features/es-syntax */
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
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
    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

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
