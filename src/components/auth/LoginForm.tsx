
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LoginCredentials } from "@/lib/types";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function LoginForm() {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login(credentials);
    } catch (error) {
      // Error will be shown through toast from auth context
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role: "admin" | "user") => {
    setIsLoading(true);
    setError("");

    try {
      await login({
        email: role === "admin" ? "admin@example.com" : "user@example.com",
        password: role === "admin" ? "admin" : "user",
      });
    } catch (error) {
      setError("Failed to login with demo account.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg animate-scale-in glass-panel">
      <CardHeader className="space-y-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">Access Weaver ERP</CardTitle>
          <ThemeToggle />
        </div>
        <CardDescription>
          Log in to your account to access the system.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={credentials.email}
              onChange={handleChange}
              required
              disabled={isLoading}
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleChange}
              required
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
        <CardFooter className="flex-col space-y-2">
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent mr-2"></span>
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </Button>
          <div className="flex w-full gap-2 mt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => handleDemoLogin("admin")}
              disabled={isLoading}
            >
              Demo Admin
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => handleDemoLogin("user")}
              disabled={isLoading}
            >
              Demo User
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
