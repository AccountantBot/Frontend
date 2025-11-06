import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export function TelegramModal() {
  const { needsTelegram, setNeedsTelegram } = useAuth();
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.startsWith('@')) {
      toast({
        title: 'Username inválido',
        description: 'Username do Telegram deve começar com @',
        variant: 'destructive',
      });
      return;
    }

    // Simulação - não faz chamada real à API
    setIsLoading(true);
    setTimeout(() => {
      toast({
        title: 'Sucesso! (Mock)',
        description: 'Telegram vinculado (simulação)',
      });
      setNeedsTelegram(false);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Dialog open={needsTelegram} onOpenChange={setNeedsTelegram}>
      <DialogContent className="glass-card">
        <DialogHeader>
          <DialogTitle className="text-2xl">Conecte seu Telegram</DialogTitle>
          <DialogDescription>
            Conecte sua conta do Telegram para receber notificações sobre pagamentos
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="telegram">Usuário do Telegram</Label>
            <Input
              id="telegram"
              placeholder="@username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2"
              required
            />
          </div>
          
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 gradient-primary"
            >
              {isLoading ? 'Vinculando...' : 'Vincular conta'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setNeedsTelegram(false)}
            >
              Pular por enquanto
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
