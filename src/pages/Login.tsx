import { LoginForm } from "@/components/auth/LoginForm";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="container mx-auto py-6">
      <LoginForm onForgotPassword={handleForgotPassword} />
    </div>
  );
};

export default Login;