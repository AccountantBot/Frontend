import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api, Split, Token } from '@/lib/api';
import { formatUnits } from 'viem';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Loader2, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const MAX_TRANSACTIONS = 5;

type TokenMap = Record<string, Token>;

export function RecentTransactions() {
  const [transactions, setTransactions] = useState<Split[]>([]);
  const [tokens, setTokens] = useState<TokenMap>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const [tokenResponse, splitResponse] = await Promise.all([
        api.getTokens(),
        api.getAllSplits(),
      ]);

      const tokenMap = tokenResponse.reduce<TokenMap>((acc, token) => {
        acc[token.address.toLowerCase()] = token;
        return acc;
      }, {});

      setTokens(tokenMap);
      setTransactions(splitResponse.slice(0, MAX_TRANSACTIONS));
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar transações recentes:', err);
      setError('Não foi possível carregar as transações agora.');
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const getTokenInfo = (address: string) => tokens[address.toLowerCase()];

  const renderStatus = (status: Split['status']) => {
    if (status === 'settled') {
      return (
        <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/50">
          Liquidação concluída
        </Badge>
      );
    }
    if (status === 'approved') {
      return <Badge variant="outline">Assinado</Badge>;
    }
    return <Badge variant="outline">Pendente</Badge>;
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Transações recentes</CardTitle>
        <CardDescription>
          Acompanhe rapidamente as últimas interações registradas pelo AccountantBot.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            Carregando transações...
          </div>
        ) : error ? (
          <div className="space-y-3">
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="outline" size="sm" onClick={loadTransactions}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar novamente
            </Button>
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground space-y-2">
            <p>Nenhuma transação encontrada por enquanto.</p>
            <p>Assim que o bot executar ações em seu nome, elas aparecerão aqui.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => {
                  const token = getTokenInfo(transaction.tokenAddress);
                  const total = transaction.items.reduce(
                    (sum, item) => sum + BigInt(item.amount),
                    BigInt(0),
                  );

                  return (
                    <TableRow key={transaction.id}>
                      <TableCell className="whitespace-nowrap text-sm">
                        {transaction.createdAt
                          ? format(new Date(transaction.createdAt), "dd 'de' MMM", { locale: ptBR })
                          : '-'}
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="font-medium">{transaction.meta.description}</div>
                        <div className="mt-1">{renderStatus(transaction.status)}</div>
                      </TableCell>
                      <TableCell className="text-sm text-right">
                        {token ? formatUnits(total, token.decimals) : '0'} {token?.symbol ?? ''}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex justify-end">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/history">Ver histórico completo</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
