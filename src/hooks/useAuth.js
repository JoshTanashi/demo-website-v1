import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function signInOrUp(email, password) {
    const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
    if (!signInErr) return { ok: true };
    const { error: signUpErr } = await supabase.auth.signUp({ email, password });
    if (signUpErr) return { ok: false, error: signUpErr.message };
    return { ok: true };
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return { user, signInOrUp, signOut };
}
