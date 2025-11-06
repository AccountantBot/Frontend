import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AllowanceManager } from '@/components/dashboard/AllowanceManager';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { TelegramModal } from '@/components/TelegramModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, MessageCircle, ShieldCheck, ArrowRight, History as HistoryIcon, ShieldCheck as ShieldIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { isAuthenticated, setNeedsTelegram } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-3xl font-bold">Conecte sua carteira</h1>
          <p className="text-muted-foreground">
            Utilize o botão no topo da página para conectar sua carteira e acessar o painel do AccountantBot.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <TelegramModal />

      <div className="container mx-auto px-4 py-8 space-y-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="w-full justify-between gap-1 rounded-xl border border-border/60 bg-background/90 p-1 shadow-sm sm:w-auto sm:justify-start">
            <TabsTrigger value="overview" className="gap-2">
              <MessageCircle className="w-4 h-4" />
              Visão geral
            </TabsTrigger>
            <TabsTrigger value="permissions" className="gap-2">
              <ShieldIcon className="w-4 h-4" />
              Autorizações
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <HistoryIcon className="w-4 h-4" />
              Histórico
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="glass-card border border-border/60">
              <CardHeader>
                <CardTitle>Bem-vindo ao painel do AccountantBot</CardTitle>
                <CardDescription>
                  Configure seus canais e permissões para que o bot cuide das divisões automaticamente.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <MessageCircle className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Conecte o Telegram</p>
                      <p>Receba alertas e instruções do bot sempre que uma nova divisão for criada.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Autorize o contrato</p>
                      <p>Defina limites seguros para que o AccountantBot execute pagamentos em seu nome.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Monitore o histórico</p>
                      <p>Acompanhe todas as transações e assinaturas registradas on-chain.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Integração com Telegram</CardTitle>
                  <CardDescription>Vincule seu usuário para que o bot reconheça suas ações com segurança.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    O AccountantBot confirma sua identidade e envia notificações pelo Telegram antes de concluir qualquer movimentação.
                  </p>
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto" onClick={() => setNeedsTelegram(true)}>
                    Conectar Telegram
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Após a conexão, o bot guiará o restante da configuração diretamente na conversa.
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>O que o bot faz por você</CardTitle>
                  <CardDescription>Todas as interações complexas acontecem no chat com o AccountantBot.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>Use este painel apenas para conceder permissões e checar as movimentações recentes.</p>
                  <ul className="space-y-2 pl-4 list-disc">
                    <li>Criar ou participar de novas divisões de gastos direto na conversa.</li>
                    <li>Receber solicitações e aprovar pagamentos com um toque.</li>
                    <li>Consultar saldos, status e próximos passos com linguagem natural.</li>
                  </ul>
                  <Button variant="ghost" size="sm" asChild>
                    <a href="https://t.me/AccountantBot" target="_blank" rel="noopener noreferrer">
                      Iniciar conversa no Telegram
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-6">
            <Card className="glass-card border border-border/60">
              <CardHeader>
                <CardTitle>Gerenciar autorizações</CardTitle>
                <CardDescription>
                  Ajuste os limites de gasto que o contrato pode utilizar em nome da sua carteira.
                </CardDescription>
              </CardHeader>
            </Card>
            <AllowanceManager />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <RecentTransactions />
            <Card className="glass-card border border-border/60">
              <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-sm text-muted-foreground">
                  Precisa de mais detalhes? Acesse o histórico completo com todas as movimentações gerenciadas pelo bot.
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/history">Abrir histórico completo</Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
