/* eslint-disable no-useless-escape */
import Joi from 'joi';

export const bodySchemaValidation = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().max(200).required(),
  access: Joi.boolean().required(),
  complete: Joi.boolean().required()
});

export const userSchemaValidation = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'ua'] }
    })
    .required(),
  password: Joi.string().min(3).max(15).required()
});
