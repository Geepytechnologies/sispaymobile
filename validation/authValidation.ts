import Joi from "joi";

const passwordSchema = Joi.string().required().empty("").messages({
  "any.required": "Please input password",
  "string.empty": "Password cannot be empty.",
});
const otpSchema = Joi.string()
  .length(6)
  .required()
  .pattern(/(?=.*\d)/)
  .message("Code must be 6 digits");

const loginSchema = Joi.object({
  phone: Joi.string().required().length(11).messages({
    "string.empty": "Phone cannot be empty.",
    "any.required": "Please input Phone Number",
    "string.length": "Phone must be 11 characters",
  }),
  password: Joi.string()
    .length(6)

    .required()
    .empty("")

    .messages({
      "any.required": "Please input password",
      "string.empty": "Password cannot be empty.",
      "string.length": "Password must be 6 characters long",
    }),
});

const registerSchema = Joi.object({
  firstname: Joi.string().required().min(2).max(60).messages({
    "string.empty": "Name cannot be empty.",
    "any.required": "Please input firstname",
  }),

  lastname: Joi.string().required().min(2).max(60).messages({
    "string.empty": "Name cannot be empty.",
    "any.required": "Please input Lastname",
  }),
  businessname: Joi.string(),
  phone: Joi.string().required().length(11).messages({
    "string.empty": "Phone cannot be empty.",
    "any.required": "Please input Phone Number",
    "string.length": "Phone must be 11 characters",
  }),
  email: Joi.string()
    .required()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .messages({
      "string.email": "Email is Invalid",
      "string.empty": "Email cannot be empty.",
      "any.required": "Please input email",
    }),
  password: Joi.string()
    .length(6)

    .required()
    .empty("")

    .messages({
      "any.required": "Please input password",
      "string.empty": "Password cannot be empty.",
      "string.length": "Password must be 6 characters long",
    }),
  confirmpassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords don't match",
    "string.empty": "Confirm password is required",
  }),
});

export { loginSchema, registerSchema };
