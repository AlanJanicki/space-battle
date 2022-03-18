import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import UsersDAO from '../dao/usersDAO.js';

import {
  validateGameLevel,
  validateLoginInput,
  validateRegisterInput,
} from '../utils/validator.js';
import verifyAuth from '../utils/verifyAuth.js';

const generateToken = (gameLevel, id, name) => {
  return jwt.sign(
    {
      gameLevel,
      id,
      name,
    },
    process.env.JSONWT_KEY,
    {
      expiresIn: '6h',
    }
  );
};

export default class UserController {
  static async deleteUser(req, res) {
    try {
      const user = verifyAuth(req);
      const authErrors = user;
      if (authErrors && authErrors.length > 0) {
        res.status(400).json(authErrors);
        return;
      }

      const errors = await UsersDAO.deleteUser(user.id);
      if (errors && errors.length > 0) {
        res.status(400).json(errors);
        return;
      }

      res.status(200).json('Użytkownik usunięty poprawnie');
    } catch (err) {
      res.status(500).json({
        errors: [
          {
            uncategorizedErrors: err.message,
          },
        ],
      });
    }
  }

  static async login(req, res) {
    try {
      const validationErrors = validateLoginInput(req.body.login, req.body.password);
      if (validationErrors.length > 0) {
        res.status(400).json(validationErrors);
        return;
      }

      const user = await UsersDAO.login({
        login: req.body.login,
        password: req.body.password,
      });

      const errors = user;
      if (errors && errors.length > 0) {
        res.status(400).json(errors);
        return;
      }

      const token = generateToken(user.gameLevel, user._id.toString(), user.name);

      res.status(200).json({
        gameLevel: user.gameLevel,
        name: user.name,
        token,
      });
    } catch (err) {
      res.status(500).json({
        errors: [
          {
            uncategorizedErrors: err.message,
          },
        ],
      });
    }
  }

  static async register(req, res) {
    try {
      const validationErrors = validateRegisterInput(
        req.body.login,
        req.body.name,
        req.body.password,
        req.body.passwordRepeated
      );
      if (validationErrors.length > 0) {
        res.status(400).json(validationErrors);
        return;
      }

      const password = await bcrypt.hash(req.body.password, 10);

      const user = await UsersDAO.register({
        gameLevel: 1,
        login: req.body.login,
        name: req.body.name,
        password,
      });

      const errors = user;
      if (errors && errors.length > 0) {
        res.status(400).json(errors);
        return;
      }

      res.status(200).json('Użytkownik utworzony poprawnie');
    } catch (err) {
      res.status(500).json({
        errors: [
          {
            uncategorizedErrors: err.message,
          },
        ],
      });
    }
  }

  static async updateGameLevel(req, res) {
    try {
      const user = verifyAuth(req);
      const authErrors = user;
      if (authErrors && authErrors.length > 0) {
        res.status(400).json(authErrors);
        return;
      }

      const validationErrors = validateGameLevel(req.body.gameLevel);
      if (validationErrors.length > 0) {
        res.status(400).json(validationErrors);
        return;
      }

      const updatedUser = await UsersDAO.updateGameLevel(user.id, req.body.gameLevel);

      const errors = updatedUser;
      if (errors && errors.length > 0) {
        res.status(400).json(errors);
        return;
      }

      const token = generateToken(
        updatedUser.gameLevel,
        updatedUser._id.toString(),
        updatedUser.name
      );

      res.status(200).json({
        gameLevel: updatedUser.gameLevel,
        name: updatedUser.name,
        token,
      });
    } catch (err) {
      res.status(500).json({
        errors: [
          {
            uncategorizedErrors: err.message,
          },
        ],
      });
    }
  }
}
