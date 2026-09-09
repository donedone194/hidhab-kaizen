"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

interface AdminUser {
  id: string;
  email: string;
  role: "owner" | "staff";
}

interface AdminAuthContextType {
  user: AdminUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  loginDemo: () => void;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check local session
    const saved = localStorage.getItem("hk_admin_session");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        // invalid
      }
    }

    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const adminUser: AdminUser = {
            id: session.user.id,
            email: session.user.email || "admin@hidhabkaizen.dz",
            role: "owner",
          };
          setUser(adminUser);
          localStorage.setItem("hk_admin_session", JSON.stringify(adminUser));
        }
      });
    }

    setLoading(false);
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (!error && data.user) {
        const adminUser: AdminUser = {
          id: data.user.id,
          email: data.user.email || email,
          role: "owner",
        };
        setUser(adminUser);
        localStorage.setItem("hk_admin_session", JSON.stringify(adminUser));
        document.cookie = "hk_admin_token=1; path=/; SameSite=Lax";
        return true;
      }
      return false;
    }

    return false;
  };

  const loginDemo = () => {
    // Disabled in production mode
    console.warn("Demo bypass is disabled for security.");
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch {
        // ignore
      }
    }
    setUser(null);
    localStorage.removeItem("hk_admin_session");
    document.cookie = "hk_admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/admin/login");
  };

  return (
    <AdminAuthContext.Provider value={{ user, loading, login, loginDemo, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}

