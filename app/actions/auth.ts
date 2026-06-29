"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { db } from "@/app/lib/db";
import { createSession, deleteSession } from "@/app/lib/session";
import { SignupFormSchema, LoginFormSchema, FormState } from "@/app/lib/definitions";

export async function signup(state: FormState, formData: FormData): Promise<FormState> {
  // 1. Validate fields
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  const validatedFields = SignupFormSchema.safeParse({
    name,
    email,
    password,
    confirmPassword,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name: validatedName, email: validatedEmail, password: validatedPassword } = validatedFields.data;

  try {
    // 2. Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: validatedEmail },
    });

    if (existingUser) {
      return {
        errors: {
          email: ["Cet email est déjà utilisé."],
        },
      };
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(validatedPassword, 10);

    // 4. Create user
    const user = await db.user.create({
      data: {
        name: validatedName,
        email: validatedEmail,
        password: hashedPassword,
      },
    });

    // 5. Create session
    await createSession(user.id);
  } catch (error) {
    console.error("Signup error:", error);
    return {
      message: "Une erreur est survenue lors de l'inscription.",
    };
  }

  // 6. Redirect
  redirect("/");
}

export async function login(state: FormState, formData: FormData): Promise<FormState> {
  // 1. Validate fields
  const email = formData.get("email");
  const password = formData.get("password");

  const validatedFields = LoginFormSchema.safeParse({
    email,
    password,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email: validatedEmail, password: validatedPassword } = validatedFields.data;

  try {
    // 2. Find user
    const user = await db.user.findUnique({
      where: { email: validatedEmail },
    });

    if (!user) {
      return {
        message: "Identifiants invalides.",
      };
    }

    // 3. Compare passwords
    const isPasswordValid = await bcrypt.compare(validatedPassword, user.password);

    if (!isPasswordValid) {
      return {
        message: "Identifiants invalides.",
      };
    }

    // 4. Create session
    await createSession(user.id);
  } catch (error) {
    console.error("Login error:", error);
    return {
      message: "Une erreur est survenue lors de la connexion.",
    };
  }

  // 5. Redirect
  redirect("/");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
