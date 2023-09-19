import { Router } from 'express';
import { userValidation } from '../../middleware/validationMiddleware';
import { userSchemaValidation } from '../../utils/validation';
import { myPassport } from '../../middleware/passport.middleware';
import { tryCatch } from '../../middleware/tryCatch';
import userController from '../../controllers/user.controllers';
import { authenticate } from '../../middleware/auth.middleware';

const router: Router = Router();

router.post(
  '/register',
  userValidation(userSchemaValidation),
  myPassport.authenticate('signup', { session: false }),
  tryCatch(userController.registerUser.bind(userController))
);

router.get(
  '/register-verify/:token',
  tryCatch(userController.verificationToken.bind(userController))
);

router.post(
  '/login',
  userValidation(userSchemaValidation),
  authenticate('login', { session: false }),
  tryCatch(userController.loginUser.bind(userController))
);

router.delete(
  '/logout',
  authenticate('jwt', { session: false }),
  tryCatch(userController.logoutUser.bind(userController))
);

router.post(
  '/update-password',
  authenticate('jwt', { session: false }),
  userValidation(userSchemaValidation),
  tryCatch(userController.changePasswordUser.bind(userController))
);

router.get(
  '/status',
  myPassport.authenticate(['jwt', 'anonymous'], { session: false }),
  tryCatch(userController.checkStatus.bind(userController))
);

export default router;
