import { Router } from 'express';
import { body, header, check, validationResult } from 'express-validator';
import { UserModel } from '../../models/User.js';
import { verifyJWT } from '../../jwt.js';

export const updateUser = Router();

updateUser.put(
  '/',
  header('Authorization').not().isEmpty().trim().custom(verifyJWT),
  body('username').not().isEmpty().trim(),

  async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    const { _id: id } = await verifyJWT(request.headers.authorization);
    const user = await UserModel.updateOne(
      { id }, { username: request.body.username }, {
      runValidators: true,
      new: true
    }, (err, doc) => {
      if (err) {
        console.log(err)
      }
      console.log(doc)
    });

    return response.status(200).json({
      ...user
    });
  }
);
