import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const Index = () => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { user } = useAuth();

  // Se o usuário estiver autenticado, redireciona diretamente para o dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleBack = () => {
    setShowForgotPassword(false);
  };

  const handleRegistrationSuccess = () => {
    toast.success("Conta criada com sucesso! Por favor, faça login.");
  };

  return (
    <div className="container flex items-center justify-center min-h-screen py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Bem-vindo</CardTitle>
          <CardDescription>
            Faça login ou crie sua conta para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showForgotPassword ? (
            <ForgotPasswordForm onBack={handleBack} />
          ) : (
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Cadastro</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <LoginForm onForgotPassword={handleForgotPassword} />
              </TabsContent>
              <TabsContent value="register">
                <RegisterForm onSuccess={handleRegistrationSuccess} />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;