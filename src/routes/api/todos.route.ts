import { Router } from 'express';
import { tryCatch } from '../../middleware/tryCatch';
import { isExist } from '../../middleware/isExist';
import todoController from '../../controllers/todo.controller';
import { bodyValidation } from '../../middleware/validationMiddleware';
import { bodySchemaValidation } from '../../utils/validation';
import { myPassport } from '../../middleware/passport.middleware';
import { Todo } from '../../entities/Todo';

const todosRouter: Router = Router();

todosRouter.get(
  '/',
  myPassport.authenticate(['jwt', 'anonymous'], { session: false }),
  tryCatch(todoController.getAllTodo.bind(todoController))
);

todosRouter.get('/:id', isExist(Todo), tryCatch(todoController.getTodoById.bind(todoController)));

todosRouter.post(
  '/create',
  myPassport.authenticate('jwt', { session: false }),
  bodyValidation(bodySchemaValidation),
  tryCatch(todoController.addOneTodo.bind(todoController))
);

todosRouter.delete(
  '/delete/:id',
  myPassport.authenticate('jwt', { session: false }),
  isExist(Todo),
  tryCatch(todoController.deleteTodoById.bind(todoController))
);

todosRouter.put(
  '/update/:id',
  myPassport.authenticate('jwt', { session: false }),
  bodyValidation(bodySchemaValidation),
  isExist(Todo),
  tryCatch(todoController.updateTodoId.bind(todoController))
);
export default todosRouter;
