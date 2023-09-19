/* eslint-disable no-useless-catch */
import { getConnection } from 'typeorm';
import { CustomError } from '../helpers/custom.errors';
import { User } from '../entities/User';
import { MyUser } from '../types/user.types';

export default class UserService {
  verificationUser = async (verificationToken: string) => {
    const newConnection = await getConnection();
    const repository = newConnection.getRepository(User);
    const user = await repository.findOne({
      where: { verify: verificationToken }
    });

    if (!user) {
      const error = new CustomError('User not found ', 404);
      throw error;
    }
    user.verify = 'true';
    await repository.save(user);
    return user;
  };

  userStatus = async (userData: MyUser) => {
    const newConnection = await getConnection();
    const repository = newConnection.getRepository(User);
    const user = await repository.findOne({ where: { email: userData.email } });
    if (user) {
      user.isOnline = true;
      await repository.save(user);
    }
    return user;
  };

  userCheckStatus = async (userData: MyUser) => {
    const newConnection = await getConnection();
    const repository = newConnection.getRepository(User);
    const user = await repository.findOne({ where: { email: userData.email } });
    return user;
  };

  userRemoveStatus = async (userData: MyUser) => {
    const newConnection = await getConnection();
    const repository = newConnection.getRepository(User);
    const user = await repository.findOne({ where: { email: userData.email } });
    if (user) {
      user.isOnline = false;
      await repository.save(user);
    }
    return user;
  };

  async changePassword(email: string, newPassword: string) {
    const newConnection = await getConnection();
    const repository = newConnection.getRepository(User);

    try {
      const user = await repository.findOne({ where: { email } });

      if (!user) {
        const error = new CustomError('User not found ', 404);
        throw error;
      }

      if (user.password === newPassword) {
        const error = new CustomError('Password is wrong ', 401);
        throw error;
      }

      user.password = newPassword;
      await repository.save(user);

      return email;
    } catch (error) {
      throw error;
    }
  }
}
