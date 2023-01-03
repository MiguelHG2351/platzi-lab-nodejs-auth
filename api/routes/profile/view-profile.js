import { Router } from 'express';
import { body, check, validationResult, header } from 'express-validator';
import { UserModel } from '../../models/User.js';
import { verifyJWT } from '../../jwt.js';

export const viewUser = Router();

viewUser.get(
  '/',
  header('Authorization').not().isEmpty().trim().custom(verifyJWT),

  async (request, response) => {
    const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }
    const payload = await verifyJWT(request.headers.authorization);
    const user = await UserModel.findById(payload.sub).lean();
    console.log(user)

    return response.status(200).json({...user, password: '******'});
  }
);
