import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet, Zap, Shield, Users, ArrowRight, CheckCircle2 } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Transações sem gas na Scroll</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Divida as Contas.
              <br />
              Zero Taxas de Gas.
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              A maneira Web3 de dividir despesas com amigos. Não custodial, aprovações sem gas via EIP-712, com a potência da Scroll.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}
                size="lg"
                className="gradient-primary text-lg px-8"
              >
                {isAuthenticated ? 'Ir para o Painel' : 'Conectar Carteira'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                <a href="https://t.me/AccountantBot" target="_blank" rel="noopener noreferrer">
                  Falar com o bot
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Por que AccountantBot?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A forma mais inteligente de gerenciar despesas em grupo no blockchain
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="glass-card hover:border-primary/50 transition-smooth group">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Aprovações sem Gas</h3>
                <p className="text-muted-foreground">
                  Assine com EIP-712. Sem taxas de transação para os participantes.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card hover:border-primary/50 transition-smooth group">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Não Custodial</h3>
                <p className="text-muted-foreground">
                  Você controla seus tokens. Sem necessidade de depósitos.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card hover:border-primary/50 transition-smooth group">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Ideal para Grupos</h3>
                <p className="text-muted-foreground">
                  Divida despesas com participantes ilimitados, de forma simples.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card hover:border-primary/50 transition-smooth group">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth">
                  <Wallet className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Multi-Token</h3>
                <p className="text-muted-foreground">
                  Suporte a USDC, USDT e outros tokens ERC-20.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-32 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Como Funciona</h2>
            <p className="text-xl text-muted-foreground">Simples, rápido e seguro</p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Conectar Telegram</h3>
              <p className="text-muted-foreground">
                Inicie a conversa com o bot para se identificar e informar quem participa das despesas.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Autorizar contrato</h3>
              <p className="text-muted-foreground">
                Use o painel para liberar limites seguros para o contrato executar os pagamentos.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Bot faz o restante</h3>
              <p className="text-muted-foreground">
                O AccountantBot coleta aprovações sem gas e liquida tudo em uma única transação on-chain.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Button
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}
              size="lg"
              className="gradient-primary"
            >
              Começar Agora
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-20 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <CheckCircle2 className="w-8 h-8 text-primary mx-auto mb-2" />
                <h4 className="font-bold text-lg mb-1">Rede Scroll</h4>
                <p className="text-sm text-muted-foreground">Construído na L2 da Ethereum</p>
              </div>
              <div>
                <CheckCircle2 className="w-8 h-8 text-primary mx-auto mb-2" />
                <h4 className="font-bold text-lg mb-1">EIP-712</h4>
                <p className="text-sm text-muted-foreground">Padrão de assinatura da indústria</p>
              </div>
              <div>
                <CheckCircle2 className="w-8 h-8 text-primary mx-auto mb-2" />
                <h4 className="font-bold text-lg mb-1">Não Custodial</h4>
                <p className="text-sm text-muted-foreground">Suas chaves, seu cripto</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
