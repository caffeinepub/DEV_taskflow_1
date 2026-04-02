import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Keyboard,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
} from "lucide-react";
import { useTaskStore } from "../store/useTaskStore";
import { SaveIndicator } from "./SaveIndicator";

interface LayoutProps {
  sidebar: React.ReactNode;
  main: React.ReactNode;
}

const SHORTCUTS = [
  { keys: "⌘N", label: "New task" },
  { keys: "⌘S", label: "Save" },
  { keys: "⌘D", label: "Complete" },
  { keys: "⌘⌫", label: "Delete" },
];

export function Layout({ sidebar, main }: LayoutProps) {
  const { sidebarOpen, setSidebarOpen, theme, setTheme } = useTaskStore();

  return (
    <TooltipProvider delayDuration={300}>
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        {/* Header */}
        <header
          className="h-11 flex items-center justify-between px-3 bg-card border-b border-border shadow-subtle shrink-0 z-10"
          data-ocid="app-header"
        >
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  aria-label={
                    sidebarOpen ? "Collapse sidebar" : "Expand sidebar"
                  }
                  data-ocid="sidebar-toggle"
                >
                  {sidebarOpen ? (
                    <PanelLeftClose className="w-4 h-4" />
                  ) : (
                    <PanelLeftOpen className="w-4 h-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              </TooltipContent>
            </Tooltip>

            <span className="text-sm font-display font-semibold tracking-tight text-foreground select-none">
              TaskFlow
            </span>
          </div>

          <div className="flex items-center gap-2">
            <SaveIndicator />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  aria-label="Toggle theme"
                  data-ocid="theme-toggle"
                >
                  {theme === "dark" ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {theme === "dark" ? "Light mode" : "Dark mode"}
              </TooltipContent>
            </Tooltip>
          </div>
        </header>

        {/* Body: sidebar + main */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Sidebar */}
          <aside
            className={`
              shrink-0 border-r border-border bg-card overflow-y-auto
              transition-all duration-300 ease-in-out
              ${sidebarOpen ? "w-56" : "w-0 overflow-hidden"}
            `}
            aria-hidden={!sidebarOpen}
            data-ocid="sidebar"
          >
            <div className="w-56">{sidebar}</div>
          </aside>

          {/* Main content */}
          <main
            className="flex-1 overflow-y-auto bg-background min-w-0"
            data-ocid="main-content"
          >
            {main}
          </main>
        </div>

        {/* Footer */}
        <footer className="h-8 flex items-center justify-between px-3 bg-card border-t border-border shrink-0">
          <div
            className="flex items-center gap-3"
            aria-label="Keyboard shortcuts"
          >
            <Keyboard className="w-3 h-3 text-muted-foreground" />
            {SHORTCUTS.map(({ keys, label }) => (
              <span
                key={keys}
                className="flex items-center gap-1 text-xs text-muted-foreground"
              >
                <kbd className="font-mono text-[10px] bg-muted px-1 py-px rounded border border-border text-muted-foreground">
                  {keys}
                </kbd>
                <span className="hidden sm:inline">{label}</span>
              </span>
            ))}
          </div>
          <span className="text-[10px] text-muted-foreground">
            © {new Date().getFullYear()}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.hostname : "",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors duration-200"
            >
              Built with caffeine.ai
            </a>
          </span>
        </footer>
      </div>
    </TooltipProvider>
  );
}
