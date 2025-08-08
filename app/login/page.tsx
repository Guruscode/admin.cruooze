"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const { login, isLoading, error: authError, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  useEffect(() => {
    if (authError) {
      setLocalError(authError);
    }
  }, [authError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (!email || !password) {
      setLocalError("Email and password are required");
      return;
    }

    try {
      const success = await login(email, password);
      if (success) {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setLocalError(err.message || "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('/deltastate.jpg')`,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[15%] w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[20%] right-[15%] w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-4 flex flex-col items-center mt-10 z-10"
      >
        <Card className="border-none shadow-[0_10px_40px_rgba(0,0,0,0.15)] bg-white/70 backdrop-blur-xl w-full rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-white/60 pointer-events-none rounded-2xl" />

          <CardHeader className="space-y-2 pb-0 pt-8 relative">
            <CardTitle className="text-3xl font-bold text-center text-gray-800">Cruooze Admin App</CardTitle>
            <CardDescription className="text-center text-gray-700 font-medium text-lg pb-6">
              Cruooze Admin Login
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-8 pt-4 px-8 relative">
            {localError && (
              <Alert
                variant="destructive"
                className="mb-6 bg-red-500/20 backdrop-blur-sm border-red-500/40 text-red-800 shadow-sm"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{localError}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-800 font-medium text-base">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-primary/70 focus:ring-primary/30 shadow-sm rounded-lg py-5 px-4 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-800 font-medium text-base">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-primary/70 focus:ring-primary/30 shadow-sm rounded-lg py-5 px-4 text-base"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#e2ad3a] hover:bg-[#b5831d] text-white border-none shadow-md py-6 rounded-lg transition-all duration-200 font-medium text-base mt-4"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}