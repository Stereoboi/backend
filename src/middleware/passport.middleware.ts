import passport from "passport";
import passportJWT from "passport-jwt";

import { v4 as uuidv4 } from "uuid";

import { Strategy as LocalStrategy } from "passport-local";

import { Strategy as AnonymousStrategy } from "passport-anonymous";

import { getConnection } from "typeorm";
import { User } from "../entities/User";

import { CustomError } from "../helpers/custom.errors";
import { transporter } from "../utils/nodemailer";
import { JwtPayload, JwtDoneCallback } from "../types/passport.types";

export const myPassport = new passport.Passport();

const { Strategy, ExtractJwt } = passportJWT;

myPassport.use(
  "signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      const newConnection = await getConnection();
      const repository = newConnection.getRepository(User);

      try {
        const user = await repository.findOne({ where: { email } });
        if (user) {
          const error = new CustomError("This user already exists", 400);
          throw error;
        }

        const verificationToken = uuidv4();
        const emailOptions = {
          from: process.env.NODEMAILER_OWNER_EMAIL,
          to: email,
          subject: "Register verification",
          html: `<b>To verify your registration tap at this <a href="${process.env.VERIFY_URL}/${verificationToken}">link</a></b>`,
        };
        await transporter.sendMail(emailOptions);

        await repository.save({
          email,
          password,
          verify: verificationToken,
          isOnline: false,
        });
        const newUser = { email, password };

        return done(null, newUser);
      } catch (error) {
        console.log(error);

        done(error);
      }
    }
  )
);

myPassport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      const newConnection = await getConnection();
      const repository = newConnection.getRepository(User);

      try {
        const user = await repository.findOne({ where: { email } });
        if (!user) {
          return done(null, false, { message: "User not found" });
        }
        if (user.verify !== "true") {
          const error = new CustomError("Please verify your account", 400);
          throw error;
        }

        if (password !== user.password) {
          const error = new CustomError("Wrong password", 400);
          throw error;
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

myPassport.use(
  new Strategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (token: JwtPayload, done: JwtDoneCallback) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);

myPassport.use(new AnonymousStrategy());
