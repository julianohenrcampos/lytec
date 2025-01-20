import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/login");
  };

  return (
    <div className="container mx-auto py-6">
      <ForgotPasswordForm onBack={handleBack} />
    </div>
  );
};

export default ForgotPassword;