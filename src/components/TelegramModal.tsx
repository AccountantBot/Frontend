import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useAccount } from 'wagmi';
import { toast } from '@/hooks/use-toast';

export function TelegramModal() {
  const { needsTelegram, setNeedsTelegram } = useAuth();
  const { address } = useAccount();
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      toast({
        title: 'Carteira não conectada',
        description: 'Por favor, conecte sua carteira primeiro',
        variant: 'destructive',
      });
      return;
    }

    // Remove o @ se o usuário incluir
    const cleanUsername = username.startsWith('@') ? username.slice(1) : username;
    
    if (!cleanUsername) {
      toast({
        title: 'Username inválido',
        description: 'Por favor, insira seu username do Telegram',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await api.linkWallet(cleanUsername, address);
      
      toast({
        title: 'Sucesso!',
        description: 'Telegram vinculado com sucesso',
      });
      
      setNeedsTelegram(false);
      setUsername('');
    } catch (error) {
      toast({
        title: 'Erro ao vincular',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
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
