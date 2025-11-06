import { createContext, useContext, useState, ReactNode } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  needsTelegram: boolean;
  setNeedsTelegram: (needs: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [needsTelegram, setNeedsTelegram] = useState(false);
  
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const logout = () => {
    disconnect();
    toast({
      title: 'Desconectado',
      description: 'Carteira desconectada com sucesso',
    });
  };

  return (
    <AuthContext.Provider
      value={{
        // Simplificado: autenticado = carteira conectada
        isAuthenticated: isConnected,
        isLoading: false,
        logout,
        needsTelegram,
        setNeedsTelegram,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de AuthProvider');
  }
  return context;
}
