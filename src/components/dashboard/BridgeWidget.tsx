import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeftRight } from 'lucide-react';
import { useEffect } from 'react';

export function BridgeWidget() {
  useEffect(() => {
    // Load LI.FI widget script
    const script = document.createElement('script');
    script.src = 'https://widget.li.fi/v1/widget.min.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <ArrowLeftRight className="w-5 h-5 text-primary" />
          <CardTitle>Fazer ponte de ativos</CardTitle>
        </div>
        <CardDescription>
          Transfira tokens para a rede Scroll usando o LI.FI Bridge
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          id="lifi-widget"
          data-lifi-widget-config={JSON.stringify({
            integrator: 'AccountantBot',
            toChain: 534352, // Scroll chain ID
            toToken: '0x06efdbff2a14a7c8e15944d1f4a48f9f95f663a4', // USDC on Scroll
            theme: {
              palette: {
                primary: { main: '#00D4FF' },
                secondary: { main: '#1E293B' },
              },
            },
          })}
        />
        <p className="text-xs text-muted-foreground mt-4">
          💡 Você precisará de ETH para taxas de gas e USDC para pagamentos na Scroll
        </p>
      </CardContent>
    </Card>
  );
}
