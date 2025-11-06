import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ModeToggle } from '@/components/ModeToggle';

export function Header() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="border-b border-border/50 backdrop-blur-xl bg-card/30 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center glow-primary transition-smooth group-hover:scale-110">
              <Wallet className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                AccountantBot
              </h1>
              <p className="text-xs text-muted-foreground">Divisão de contas sem gas</p>
            </div>
          </button>

          <div className="flex items-center gap-3">
            <ModeToggle />
            <ConnectButton />
            
            {isAuthenticated && (
              <Button
                onClick={logout}
                variant="outline"
                size="icon"
                title="Desconectar"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
