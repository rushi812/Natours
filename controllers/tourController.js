const Tour = require('../models/tourModel');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

exports.getAllTours = async (req, res) => {
  try {
    // BUILD QUERY
    const queryObj = { ...req.query };
    const excudedFields = ['page', 'sort', 'limit', 'fields'];
    excudedFields.forEach((el) => delete queryObj[el]);

    const query = Tour.find(queryObj);

    // const tours = await Tour.find()
    //   .where('duraction')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    // EXECUTE QUERY
    const tours = await query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'SUCCESS',
      totalCount: tours.length,
      data: { tours },
    });
  } catch (err) {
    res.status(404).json({
      status: 'FAILED',
      message: err,
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
