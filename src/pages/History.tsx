import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { api, Split, Token } from '@/lib/api';
import { ExternalLink, History as HistoryIcon } from 'lucide-react';
import { formatUnits } from 'viem';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';

export default function History() {
  const { isAuthenticated } = useAuth();
  
  const [splits, setSplits] = useState<Split[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [tokenResponse, splitResponse] = await Promise.all([
        api.getTokens(),
        api.getAllSplits(),
      ]);

      setTokens(tokenResponse);
      setSplits(splitResponse);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar histórico de transações:', err);
      setSplits([]);
      setError('Não foi possível carregar o histórico agora.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    loadData();
  }, [isAuthenticated, loadData]);

  const getTokenInfo = (address: string) => {
    return tokens.find(t => t.address.toLowerCase() === address.toLowerCase());
  };

  const calculateTotal = (split: Split) => {
    return split.items.reduce((sum, item) => sum + BigInt(item.amount), BigInt(0));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-3xl font-bold">Conecte sua carteira</h1>
          <p className="text-muted-foreground">
            Conecte-se para visualizar o histórico de transações no AccountantBot.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <HistoryIcon className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Histórico de Transações</h1>
          </div>
          <p className="text-muted-foreground">Veja todas as suas divisões e pagamentos anteriores</p>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Todas as Transações</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-12 text-center text-sm text-muted-foreground flex items-center justify-center gap-3">
                <Loader2 className="w-4 h-4 animate-spin" />
                Carregando histórico...
              </div>
            ) : error ? (
              <div className="py-12 text-center space-y-3">
                <p className="text-sm text-destructive">{error}</p>
                <Button variant="outline" size="sm" onClick={loadData}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Tentar novamente
                </Button>
              </div>
            ) : splits.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">
                  Ainda não há transações registradas. Assim que o bot executar movimentações, elas aparecerão aqui.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {splits.map((split) => {
                      const token = getTokenInfo(split.tokenAddress);
                      const total = calculateTotal(split);

                      return (
                        <TableRow key={split.id}>
                          <TableCell className="font-medium">
                            {split.createdAt ? format(new Date(split.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : '-'}
                          </TableCell>
                          <TableCell>{split.meta.description}</TableCell>
                          <TableCell>
                            {token ? formatUnits(total, token.decimals) : '0'} {token?.symbol}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={split.status === 'settled' ? 'default' : 'outline'}
                              className={split.status === 'settled' ? 'bg-green-500/20 text-green-400 border-green-500/50' : ''}
                            >
                              {split.status === 'settled' ? 'Liquidado' : split.status === 'approved' ? 'Aprovado' : 'Pendente'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {split.txHash && (
                              <a
                                href={`https://scrollscan.com/tx/${split.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-primary hover:underline text-sm"
                              >
                                Ver TX
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
