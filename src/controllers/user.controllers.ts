import { Response, Request } from "express";
import jwt from "jsonwebtoken";
import UserService from "../services/user.service";
import { MyUser } from "../types/user.types";

export class UserController {
  constructor(private userService: UserService) {}

  registerUser(req: Request, res: Response) {
    res.status(200).json({
      message: "Successfully registered",
      user: req.user,
    });
  }

  async checkStatus(req: Request, res: Response) {
    const user = req.user as MyUser;

    if (user) {
      const response = await this.userService.userCheckStatus(user!);
      res.status(200).json({ response });
    }
    res.status(200).json({
      response: {
        isOnline: false,
      },
    });
  }

  async verificationToken(req: Request, res: Response) {
    const { token } = req.params;

    await this.userService.verificationUser(token);
    // return res.status(200).json('Verification successful');
    res.redirect(302, "http://localhost:3000/");
  }

  async loginUser(req: Request, res: Response) {
    const user = req.user as MyUser;
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      // Обробка випадку, коли JWT_SECRET не визначено
      console.error("JWT_SECRET is not defined in environment variables.");
      // Додайте додатковий код або виходьте з функції/методу в залежності від вашого випадку
    } else {
      await this.userService.userStatus(user!);
      const token = jwt.sign({ user }, jwtSecret);
      return res.status(200).json({ token });
    }
    // const token = jwt.sign({ user }, process.env.JWT_SECRET);
    // return res.status(200).json({ token });
  }

  async logoutUser(req: Request, res: Response) {
    const user = req.user as MyUser;

    await this.userService.userRemoveStatus(user!);
    req.logout((err) => {
      if (err) {
        throw new Error(err);
      }
      req.session.destroy(() => {
        res.status(200).json({ message: "logd out" });
      });
    });
  }

  async changePasswordUser(req: Request, res: Response) {
    const { email, password } = req.body;
    const emailUser = await this.userService.changePassword(email, password);
    res.status(200).json({
      message: `User ${emailUser} password was changed`,
    });
  }
}

const userController = new UserController(new UserService());
export default userController;
