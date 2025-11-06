import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api, Token, SplitItem } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { Plus, Trash2, Users, DivideSquare } from 'lucide-react';
import { parseUnits } from 'viem';

export default function CreateSplit() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [tokens, setTokens] = useState<Token[]>([]);
  const [description, setDescription] = useState('');
  const [selectedToken, setSelectedToken] = useState('');
  const [participants, setParticipants] = useState<SplitItem[]>([
    { participant_wallet: '', amount: '' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadTokens = useCallback(async () => {
    // Mock data
    const mockTokens: Token[] = [
      {
        address: '0x06efdbff2a14a7c8e15944d1f4a48f9f95f663a4',
        symbol: 'USDC',
        decimals: 6,
        chainId: 534352,
      },
      {
        address: '0xf55bec9cafdbe8730f096aa55dad6d22d44099df',
        symbol: 'USDT',
        decimals: 6,
        chainId: 534352,
      },
    ];
    
    setTokens(mockTokens);
    if (mockTokens.length > 0) {
      setSelectedToken(mockTokens[0].address);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    loadTokens();
  }, [isAuthenticated, loadTokens]);

  const addParticipant = () => {
    setParticipants([...participants, { participant_wallet: '', amount: '' }]);
  };

  const removeParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const updateParticipant = (index: number, field: keyof SplitItem, value: string) => {
    const updated = [...participants];
    updated[index] = { ...updated[index], [field]: value };
    setParticipants(updated);
  };

  const splitEqually = () => {
    const totalAmount = participants.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
    const perPerson = (totalAmount / participants.length).toFixed(2);
    
    const updated = participants.map(p => ({
      ...p,
      amount: perPerson
    }));
    setParticipants(updated);

    toast({
      title: 'Divisão igual',
      description: `Cada participante deve ${perPerson}`,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      toast({
        title: 'Descrição ausente',
        description: 'Informe uma descrição para esta divisão',
        variant: 'destructive',
      });
      return;
    }

    if (participants.some(p => !p.participant_wallet || !p.amount)) {
      toast({
        title: 'Participantes incompletos',
        description: 'Todos os participantes precisam informar carteira e valor',
        variant: 'destructive',
      });
      return;
    }

    const token = tokens.find(t => t.address === selectedToken);
    if (!token) return;

    setIsSubmitting(true);
    
    // Simulação - não faz chamada real à API
    setTimeout(() => {
      toast({
        title: 'Split criado! 🎉 (Mock)',
        description: 'Participantes podem aprovar (simulação)',
      });
      setIsSubmitting(false);
      navigate('/dashboard');
    }, 1500);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-3xl font-bold">Conecte sua carteira</h1>
          <p className="text-muted-foreground">
            Conecte sua carteira para criar novas divisões no AccountantBot.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Criar Divisão</h1>
          <p className="text-muted-foreground">Configure uma nova divisão de pagamento com o seu grupo</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Detalhes da Divisão</CardTitle>
              <CardDescription>
                Informe a descrição e selecione os participantes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  placeholder="ex.: Jantar no restaurante de sushi"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Token de Pagamento</Label>
                <Select value={selectedToken} onValueChange={setSelectedToken}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tokens.map((token) => (
                      <SelectItem key={token.address} value={token.address}>
                        {token.symbol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Participantes
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={splitEqually}
                    disabled={participants.length === 0}
                  >
                    <DivideSquare className="w-4 h-4 mr-2" />
                    Dividir igualmente
                  </Button>
                </div>

                {participants.map((participant, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Endereço da carteira 0x..."
                      value={participant.participant_wallet}
                      onChange={(e) => updateParticipant(index, 'participant_wallet', e.target.value)}
                      className="flex-1"
                      required
                    />
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Valor"
                      value={participant.amount}
                      onChange={(e) => updateParticipant(index, 'amount', e.target.value)}
                      className="w-32"
                      required
                    />
                    {participants.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeParticipant(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addParticipant}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar participante
                </Button>
              </div>

              <div className="pt-4 space-y-3">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full gradient-primary"
                  size="lg"
                >
                  {isSubmitting ? 'Criando...' : 'Criar Divisão'}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  className="w-full"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
