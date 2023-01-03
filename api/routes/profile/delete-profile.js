import { Router } from 'express';
import { body, check, validationResult, header } from 'express-validator';
import { UserModel } from '../../models/User.js';
import { verifyJWT } from '../../jwt.js';

export const deleteUser = Router();

deleteUser.delete(
  '/',
  header('Authorization').not().isEmpty().trim().custom(verifyJWT),

  async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    const { _id: id } = await verifyJWT(request.headers.authorization);
    const user = await UserModel.deleteOne({ id: id })

    return response.status(200).json({
      ...user
    });
  }
);
