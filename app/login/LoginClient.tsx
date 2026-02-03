"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

export default function LoginClient() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName || email.split("@")[0] },
          },
        });
        if (error) throw error;
        setConfirmationSent(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Une erreur est survenue";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (confirmationSent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black p-4">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="text-5xl">✉️</div>
          <h1 className="text-2xl font-bold text-black dark:text-white">
            Vérifiez votre email
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Un lien de confirmation a été envoyé à <strong>{email}</strong>.
            Cliquez dessus pour activer votre compte.
          </p>
          <button
            onClick={() => {
              setConfirmationSent(false);
              setIsSignUp(false);
            }}
            className="text-sm text-zinc-500 underline hover:text-black dark:hover:text-white"
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Producteur de Films
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            {isSignUp ? "Créer un compte" : "Se connecter"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Nom d&apos;affichage
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Votre nom"
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-800 focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-white dark:focus:ring-white"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
              required
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-800 focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-white dark:focus:ring-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-800 focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-white dark:focus:ring-white"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-black px-6 py-3 text-lg font-medium text-white transition-all hover:bg-zinc-800 active:scale-[0.98] disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            {loading
              ? "Chargement..."
              : isSignUp
              ? "Créer mon compte"
              : "Se connecter"}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
            }}
            className="text-sm text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
          >
            {isSignUp
              ? "Déjà un compte ? Se connecter"
              : "Pas de compte ? Créer un compte"}
          </button>
        </div>
      </div>
    </div>
  );
}
