"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "@/app/actions/auth";
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 px-4 py-12 font-sans sm:px-6 lg:px-8">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-violet-600/20 blur-[128px]" />
        <div className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-indigo-600/20 blur-[128px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo / Branding */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 shadow-lg shadow-indigo-500/30">
            <span className="text-xl font-bold text-white">T</span>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white">
            Connexion
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Bienvenue sur <span className="font-semibold text-indigo-400">TanaConnect</span>. Connectez-vous pour continuer.
          </p>
        </div>

        {/* Card Form */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-xl">
          {state?.message && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{state.message}</span>
            </div>
          )}

          <form action={action} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                Adresse email
              </label>
              <div className="relative mt-1.5 rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="jean.dupont@exemple.com"
                  className={`block w-full rounded-xl border bg-slate-950/80 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-550 ${
                    state?.errors?.email
                      ? "border-red-500 focus:border-red-500"
                      : "border-slate-800 hover:border-slate-700 focus:border-indigo-500"
                  }`}
                />
              </div>
              {state?.errors?.email && (
                <p className="mt-1.5 text-xs text-red-400">{state.errors.email[0]}</p>
              )}
            </div>

            {/* Mot de passe */}
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                  Mot de passe
                </label>
              </div>
              <div className="relative mt-1.5 rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className={`block w-full rounded-xl border bg-slate-950/80 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-550 ${
                    state?.errors?.password
                      ? "border-red-500 focus:border-red-500"
                      : "border-slate-800 hover:border-slate-700 focus:border-indigo-500"
                  }`}
                />
              </div>
              {state?.errors?.password && (
                <p className="mt-1.5 text-xs text-red-400">{state.errors.password[0]}</p>
              )}
            </div>

            {/* Bouton de soumission */}
            <button
              type="submit"
              disabled={pending}
              className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:from-violet-550 hover:to-indigo-550 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50"
            >
              {pending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>

          {/* Lien de redirection */}
          <div className="mt-6 text-center text-sm">
            <span className="text-slate-400">Vous n&apos;avez pas de compte ? </span>
            <Link href="/signup" className="font-semibold text-indigo-400 transition-colors hover:text-indigo-300">
              S&apos;inscrire
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
