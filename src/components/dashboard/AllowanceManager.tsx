import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { api, Token } from '@/lib/api';
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { parseUnits, formatUnits, maxUint256 } from 'viem';
import { toast } from '@/hooks/use-toast';
import { Shield, Infinity } from 'lucide-react';
import { scroll } from 'wagmi/chains';

const ERC20_ABI = [
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const;

export function AllowanceManager() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [selectedToken, setSelectedToken] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [currentAllowance, setCurrentAllowance] = useState<string>('0');
  const [isUnlimited, setIsUnlimited] = useState(false);

  const { address } = useAccount();
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

  useEffect(() => {
    loadTokens();
  }, []);

  useEffect(() => {
    if (selectedToken) {
      loadAllowance();
    }
  }, [selectedToken]);

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: 'Autorização aprovada!',
        description: 'Transação confirmada com sucesso',
      });
      loadAllowance();
    }
  }, [isSuccess]);

  const loadTokens = async () => {
    // Mock data - tokens de exemplo
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
  };

  const loadAllowance = async () => {
    // Mock - simula allowance zero
    setCurrentAllowance('0');
  };

  const handleApprove = async () => {
    if (!selectedToken || (!amount && !isUnlimited)) {
      toast({
        title: 'Entrada inválida',
        description: 'Selecione um token e informe um valor',
        variant: 'destructive',
      });
      return;
    }

    const token = tokens.find(t => t.address === selectedToken);
    if (!token) return;

    try {
      const approveAmount = isUnlimited 
        ? maxUint256 
        : parseUnits(amount, token.decimals);

      writeContract({
        account: address,
        chain: scroll,
        address: selectedToken as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [contractAddress as `0x${string}`, approveAmount],
      });

      toast({
        title: 'Transação enviada',
        description: 'Confirme na sua carteira',
      });
    } catch (error: any) {
      toast({
        title: 'Falha na transação',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const selectedTokenData = tokens.find(t => t.address === selectedToken);

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <CardTitle>Autorizações de Token</CardTitle>
        </div>
        <CardDescription>
          Defina limites de gasto para o AccountantBot gerenciar seus pagamentos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Selecione o token</Label>
          <Select value={selectedToken} onValueChange={setSelectedToken}>
            <SelectTrigger>
              <SelectValue placeholder="Escolha um token" />
            </SelectTrigger>
            <SelectContent>
              {tokens.map((token) => (
                <SelectItem key={token.address} value={token.address}>
                  {token.symbol}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedTokenData && currentAllowance !== '0' && (
            <p className="text-sm text-muted-foreground">
              Autorização atual: {formatUnits(BigInt(currentAllowance), selectedTokenData.decimals)} {selectedTokenData.symbol}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Valor</Label>
          <Input
            type="number"
            placeholder="Informe o valor"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isUnlimited}
          />
        </div>

        <Button
          variant={isUnlimited ? "default" : "outline"}
          onClick={() => setIsUnlimited(!isUnlimited)}
          className="w-full"
        >
          <Infinity className="w-4 h-4 mr-2" />
          {isUnlimited ? 'Ilimitado definido' : 'Definir como ilimitado'}
        </Button>

        <Button
          onClick={handleApprove}
          disabled={isConfirming}
          className="w-full gradient-primary"
        >
          {isConfirming ? 'Confirmando...' : 'Aprovar autorização'}
        </Button>

        <p className="text-xs text-muted-foreground">
          ⚠️ Esta transação exige gas. Você está concedendo permissão para o AccountantBot movimentar seus tokens em seu nome.
        </p>
      </CardContent>
    </Card>
  );
}
