import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api, Split, Token } from '@/lib/api';
import { useSignTypedData, useAccount } from 'wagmi';
import { toast } from '@/hooks/use-toast';
import { CheckCircle2, Clock, FileSignature } from 'lucide-react';
import { formatUnits } from 'viem';

export function PendingDebts() {
  const [debts, setDebts] = useState<Split[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [signingId, setSigningId] = useState<string | null>(null);

  const { address } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Mock data
    const mockTokens: Token[] = [
      {
        address: '0x06efdbff2a14a7c8e15944d1f4a48f9f95f663a4',
        symbol: 'USDC',
        decimals: 6,
        chainId: 534352,
      },
    ];
    
    // Mock - sem dívidas pendentes por enquanto
    setDebts([]);
    setTokens(mockTokens);
  };

  const handleApprove = async (split: Split) => {
    setSigningId(split.id);
    
    // Simulação de assinatura (sem chamada real)
    setTimeout(() => {
      toast({
        title: 'Pagamento aprovado! ✨ (Mock)',
        description: 'Assinatura gasless registrada (simulação)',
      });
      setSigningId(null);
      loadData();
    }, 1500);
  };

  const getTokenInfo = (address: string) => {
    return tokens.find(t => t.address.toLowerCase() === address.toLowerCase());
  };

  if (debts.length === 0) {
    return (
      <Card className="glass-card">
        <CardContent className="py-12 text-center">
          <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
          <p className="text-lg font-medium">Tudo em dia!</p>
          <p className="text-muted-foreground">Não há pagamentos pendentes para aprovar</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {debts.map((debt) => {
        const token = getTokenInfo(debt.tokenAddress);
        const myDebt = debt.items.find(item => 
          item.participant_wallet.toLowerCase() === debt.payer?.toLowerCase()
        );

        return (
          <Card key={debt.id} className="glass-card hover:border-primary/50 transition-smooth">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{debt.meta.description}</CardTitle>
                  <CardDescription className="mt-1">
                    Pago por {debt.payer.slice(0, 6)}...{debt.payer.slice(-4)}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="border-primary/50 text-primary">
                  <Clock className="w-3 h-3 mr-1" />
                  Pendente
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                <p className="text-sm text-muted-foreground mb-1">Você deve</p>
                <p className="text-2xl font-bold text-primary">
                  {myDebt && token ? formatUnits(BigInt(myDebt.amount), token.decimals) : '0'} {token?.symbol}
                </p>
              </div>

              <Button
                onClick={() => handleApprove(debt)}
                disabled={signingId === debt.id}
                className="w-full gradient-primary"
              >
                <FileSignature className="w-4 h-4 mr-2" />
                {signingId === debt.id ? 'Assinando...' : 'Aprovar pagamento (sem gas)'}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                ✨ Esta é uma assinatura sem gas — nenhuma taxa de transação é necessária
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
