import { z } from "zod";

export const SignupFormSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Le nom doit contenir au moins 2 caractères." })
      .trim(),
    email: z
      .string()
      .email({ message: "Veuillez entrer une adresse email valide." })
      .trim(),
    password: z
      .string()
      .min(6, { message: "Le mot de passe doit contenir au moins 6 caractères." })
      .trim(),
    confirmPassword: z.string().trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });

export const LoginFormSchema = z.object({
  email: z.string().email({ message: "Veuillez entrer une adresse email valide." }).trim(),
  password: z.string().min(1, { message: "Le mot de passe est requis." }),
});

export type FormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
      };
      message?: string;
      success?: boolean;
    }
  | undefined;
