import { Response, Request } from 'express';
import TodoService from '../services/todo.service';
import { IUserAuthStatusRequest } from '../types/user.types';

export class TodoController {
  constructor(private todoService: TodoService) {}

  async getAllTodo(req: Request, res: Response) {
    const data = await this.todoService.findAllTodos(req);
    res.status(200).json({ data });
  }

  async getTodoById(req: Request, res: Response) {
    const { id } = req.params;
    const data = await this.todoService.getTodoById(id);
    res.status(200).json(data);
  }

  async addOneTodo(req: Request, res: Response) {
    const newTodo = req.body;

    const { user } = req;
    console.log(user);

    if (user) {
      const data = await this.todoService.addTodo(newTodo, user);
      res.status(201).json({ data, status: 'success' });
    } else res.status(403).json({ status: 'You need sign up to do this' });
  }

  async deleteTodoById(req: IUserAuthStatusRequest, res: Response) {
    const { id } = req.params;
    await this.todoService.removeTodoById(req, id);
    return res.status(200).json({ massage: `todo #id ${id} removed` });
  }

  async updateTodoId(req: IUserAuthStatusRequest, res: Response) {
    const { id } = req.params;
    const todo = req.body;
    await this.todoService.updateTodo(req, todo, id);
    res.status(200).json({ massage: `todo #id ${id} updated` });
  }
}

const todoController = new TodoController(new TodoService());
export default todoController;
