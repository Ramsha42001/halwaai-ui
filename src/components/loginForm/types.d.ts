declare module "@/components/loginForm/page" {
  interface LoginFormProps {
    onSubmit: (credentials: { email: string; password: string }) => Promise<void>;
    isLoading: boolean;
  }
  
  export const LoginForm: React.FC<LoginFormProps>;
} 