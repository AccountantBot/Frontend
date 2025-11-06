import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { api, Split, Token } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { CheckCircle2, ExternalLink, Loader2, Users } from 'lucide-react';
import { formatUnits } from 'viem';

export function MySplitsToSettle() {
  const [splits, setSplits] = useState<Split[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [settlingId, setSettlingId] = useState<string | null>(null);

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
    
    // Mock - sem splits por enquanto
    setSplits([]);
    setTokens(mockTokens);
  };

  const handleSettle = async (splitId: string) => {
    setSettlingId(splitId);
    
    // Simulação de liquidação
    setTimeout(() => {
      toast({
        title: 'Liquidação iniciada! 🎉 (Mock)',
        description: 'Transação simulada com sucesso',
      });
      setSettlingId(null);
      loadData();
    }, 2000);
  };

  const getTokenInfo = (address: string) => {
    return tokens.find(t => t.address.toLowerCase() === address.toLowerCase());
  };

  const calculateTotal = (split: Split) => {
    return split.items.reduce((sum, item) => sum + BigInt(item.amount), BigInt(0));
  };

  if (splits.length === 0) {
    return (
      <Card className="glass-card">
        <CardContent className="py-12 text-center">
          <Users className="w-12 h-12 text-primary mx-auto mb-4" />
          <p className="text-lg font-medium">Nenhuma divisão ativa</p>
          <p className="text-muted-foreground">Crie uma divisão para começar</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {splits.map((split) => {
        const token = getTokenInfo(split.tokenAddress);
        const total = calculateTotal(split);
        const approvalProgress = ((split.approvalCount || 0) / (split.totalApprovals || 1)) * 100;
        const canSettle = (split.approvalCount || 0) > 0;

        return (
          <Card key={split.id} className="glass-card hover:border-primary/50 transition-smooth">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{split.meta.description}</CardTitle>
                  <CardDescription className="mt-1">
                    {split.items.length} participante{split.items.length !== 1 ? 's' : ''}
                  </CardDescription>
                </div>
                <Badge 
                  variant={split.status === 'settled' ? 'default' : 'outline'}
                  className={split.status === 'settled' ? 'bg-green-500/20 text-green-400 border-green-500/50' : ''}
                >
                  {split.status === 'settled' ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Liquidado
                    </>
                  ) : (
                    'Pendente'
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                <p className="text-sm text-muted-foreground mb-1">Valor total</p>
                <p className="text-2xl font-bold">
                  {token ? formatUnits(total, token.decimals) : '0'} {token?.symbol}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Aprovações</span>
                  <span className="font-medium">
                    {split.approvalCount || 0} / {split.totalApprovals || split.items.length}
                  </span>
                </div>
                <Progress value={approvalProgress} className="h-2" />
              </div>

              {split.status !== 'settled' && (
                <Button
                  onClick={() => handleSettle(split.id)}
                  disabled={!canSettle || settlingId === split.id}
                  className="w-full gradient-primary"
                >
                  {settlingId === split.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Liquidando...
                    </>
                  ) : (
                    'Liquidar pagamento'
                  )}
                </Button>
              )}

              {split.txHash && (
                <a
                  href={`https://scrollscan.com/tx/${split.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-sm text-primary hover:underline"
                >
                  Ver transação
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
