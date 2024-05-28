import * as z from "zod";

const loginPattern = /^(?!\d)[a-zA-Z0-9._-]+$/;

const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z_\d@$!%*?&]{6,}$/;

export const LoginSchema = z.object({
  email: z.string().email("Введите действительный адрес электронной почты"),
  password: z.string().min(6, "Пароль должен содержать не менее 8 символов"),
  remember: z.boolean().optional(),
});

export const RegisterSchema = z
  .object({
    email: z.string().email("Введите действительный адрес электронной почты"),
    login: z
      .string()
      .min(2, "Слишком короткий логин")
      .max(20, "Логин не должен быть длиннее 14 символов")
      .regex(
        loginPattern,
        "Логин может включать только латинские буквы, цифры, точки, дефисы и подчеркивания, и не должен начинаться с цифры"
      ),
    password: z
      .string()
      .min(6, "Пароль должен содержать минимум 8 символов")
      .regex(
        passwordPattern,
        "Пароль должен включать как минимум одну заглавную букву, одну строчную букву, одну цифру и один специальный символ"
      ),
    secondPassword: z
      .string()
      .min(6, "Пароль должен содержать минимум 8 символов")
      .regex(
        passwordPattern,
        "Пароль должен включать как минимум одну заглавную букву, одну строчную букву, одну цифру и один специальный символ"
      ),
  })
  .refine((data) => data.password === data.secondPassword, {
    path: ["secondPassword"],
    message: "Пароли не совпадают",
  });

export const EditProfileSchema = z.object({
  login: z
    .string({ required_error: "Логин обязателен" })
    .min(2, "Логин должен содержать не менее 2 символов")
    .max(20, "Логин не должен быть длиннее 14 символов")
    .regex(
      loginPattern,
      "Логин может включать только латинские буквы, цифры, точки, дефисы и подчеркивания, и не должен начинаться с цифры"
    ),
  desc: z
    .string()
    .max(1000, "Описание должно быть не длиннее 1000 символов")
    .optional(),
});
