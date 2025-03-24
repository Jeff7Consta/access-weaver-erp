
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="h-full w-full bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      </div>
      <div className="z-10">
        <LoginForm />
      </div>
    </div>
  );
}
