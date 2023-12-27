const router = require('express').Router();
const {
  getUsers,
  getUsersById,
  createUser,
  patchProfile,
  patchAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/:userId', getUsersById);

router.post('/users', createUser);

router.patch('/users/me', patchProfile);

router.patch('/users/me/avatar', patchAvatar);

module.exports = router;
