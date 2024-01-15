const router = require('express').Router();
const {
  getUsers,
  getUsersById,
  patchProfile,
  patchAvatar,
  getThisUser,
} = require('../controllers/users');
const { userIdValidation, userValidation, avatarValidation } = require('../middlewares/validation');

router.get('/users', getUsers);

router.get('/users/me', getThisUser);

router.get('/users/:userId', userIdValidation, getUsersById);

router.patch('/users/me', userValidation, patchProfile);

router.patch('/users/me/avatar', avatarValidation, patchAvatar);

module.exports = router;
