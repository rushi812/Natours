const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

const { getAllUser, createUser, getUser, updateUser, deleteUser } =
  userController;

router.route('/').get(getAllUser).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
