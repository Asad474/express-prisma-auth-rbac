import z from "zod";

const registerUserSchema = z.object({
  email: z.email(),

  firstName: z.string(),
  lastName: z.string().optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),
  username: z
    .string()
    .max(8, "Username must be at most 8 characters")
    .regex(/\d/, "Username must contain at least one number"),
});

const loginUserSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const authValidator = {
  loginUserSchema,
  registerUserSchema,
};
