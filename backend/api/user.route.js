import express from 'express';
import UserController from './user.controller.js';

const router = express.Router();

router.route('/delete').delete(UserController.deleteUser);
router.route('/login').post(UserController.login);
router.route('/register').post(UserController.register);
router.route('/update').patch(UserController.updateGameLevel);

export default router;
