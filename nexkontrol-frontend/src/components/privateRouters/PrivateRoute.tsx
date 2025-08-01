import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../Context/AuthContext";
import LoadingSpinner from "../ui/LoadingSpinner";

interface Props {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: Props) {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return <LoadingSpinner size="xl" text="Verificando autenticação..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
