import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { MindSortApp } from "./components/MindSortApp";
import { ThemeProvider } from "./components/ThemeProvider";

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm h-16 flex justify-between items-center border-b border-border shadow-sm px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">MS</span>
            </div>
            <h2 className="text-xl font-mono font-semibold">MindSort</h2>
          </div>
          <Authenticated>
            <SignOutButton />
          </Authenticated>
        </header>
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-6xl mx-auto">
            <Content />
          </div>
        </main>
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <Authenticated>
        <MindSortApp />
      </Authenticated>
      
      <Unauthenticated>
        <div className="text-center max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-mono font-bold mb-4">
              Mind<span className="text-primary">Sort</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-2">
              Transform chaos into clarity
            </p>
            <p className="text-sm text-muted-foreground">
              Turn your scattered thoughts into organized, actionable tasks with AI
            </p>
          </div>
          <SignInForm />
        </div>
      </Unauthenticated>
    </div>
  );
}
