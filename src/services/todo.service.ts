/* eslint-disable no-empty */
/* eslint-disable no-else-return */
import { getConnection, getRepository } from 'typeorm';
import { Request } from 'express';
import { Todo } from '../entities/Todo';

import { ITodo } from '../types/todos.type';
import { UserType, IUserAuthStatusRequest } from '../types/user.types';
import { CustomError } from '../helpers/custom.errors';

export default class TodoService {
  async findAllTodos(req: Request) {
    const { status, search, page } = req.query;
    const perPage = 6;
    const data = req.user;
    const todoRepository = getRepository(Todo);

    let query = todoRepository.createQueryBuilder('todo');

    if (status) {
      if (status === 'all') {
      } else if (status === 'private') {
        query = query.where('todo.access = true');
      } else if (status === 'public') {
        query = query.where('todo.access = false');
      } else if (status === 'complete') {
        query = query.where('todo.complete = true');
      }
    }

    if (search) {
      query = query.andWhere('(todo.title ILIKE :search OR todo.description ILIKE :search)', {
        search: `%${search}%`
      });
    }

    query = query.orderBy('todo.id', 'DESC');

    if (page && perPage) {
      const pageNumber = parseInt(page.toString(), 10) || 1;
      const itemsPerPage = parseInt(perPage.toString(), 10) || 6;
      const skip = (pageNumber - 1) * itemsPerPage;
      query = query.skip(skip).take(itemsPerPage);
    }

    if (data) {
      const totalCount = await query.getCount();
      const todos = await query.take(perPage).getMany();
      return { data: todos, totalCount };
    } else {
      const totalCount = await query.andWhere('todo.access = false').getCount();
      const todos = await query.andWhere('todo.access = false').take(perPage).getMany();
      return { data: todos, totalCount };
    }
  }

  async getTodoById(id: string) {
    const newConnection = getConnection();
    const todoRepository = newConnection.getRepository(Todo);
    const oneTodo = await todoRepository.findOne({ where: { id } });

    return oneTodo;
  }

  async addTodo(newTodo: ITodo, user: UserType) {
    const newConnection = await getConnection();
    const todoRepository = newConnection.getRepository(Todo);
    const createdTodo = { ...newTodo, owner: user.id };
    const data = await todoRepository.save(createdTodo);
    return data;
  }

  async removeTodoById(req: IUserAuthStatusRequest, id: string) {
    const newConnection = getConnection();
    const { user } = req;
    const todoRepository = newConnection.getRepository(Todo);

    const todo = await todoRepository.findOne({ where: { id, owner: user.id } });

    if (todo) {
      const removeTodo = await todoRepository.delete(todo.id);
      return removeTodo;
    } else if (!user) {
      throw new CustomError('unauthorized please sign up', 401);
    } else {
      throw new CustomError('You do not have permission to delete this todo', 403);
    }
  }

  async updateTodo(req: IUserAuthStatusRequest, todo: ITodo, id: string) {
    const newConnection = getConnection();
    const { user } = req;
    const todoRepository = newConnection.getRepository(Todo);
    const existingTodo = await todoRepository.findOne({ where: { id, owner: user.id } });
    if (existingTodo) {
      await todoRepository.update(id, { ...todo });
      return { success: true };
    } else if (!user) {
      throw new CustomError('unauthorized please sign up', 401);
    } else {
      throw new CustomError('You do not have permission to update this todo', 403);
    }
  }
}
