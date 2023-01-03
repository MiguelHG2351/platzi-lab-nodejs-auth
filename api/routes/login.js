import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { UserModel } from '../models/User.js';
import { signJWT } from '../jwt.js';

export const login = Router();

login.post(
  '/',
  // Validación y sanitización de los datos de entrada
  body('username').not().isEmpty().trim(),
  body('password').isLength({ min: 6 }),

  //
  async (request, response) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
      }

      const { username, password } = request.body;

      const user = await UserModel.findOne({ username });

      if (!user) {
        return response.status(400).json({
          error: 'username or password is incorrect',
        });
      }

      const isPasswordValid = await user.matchPassword(password);
      if (!isPasswordValid) {
        return response.status(400).json({
          error: 'username or password is incorrect',
        });
      }

      const token = await signJWT(username, user._id)

      return response.status(201).json({ token, username: user.username });
    } catch (error) {
      console.error(`[signIn]: ${error}`);

      return response.status(500).json({
        error: 'An unexpected error happened. Please try again later',
      });
    }
  }
);
