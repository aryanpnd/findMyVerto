import { NavigationContainer } from '@react-navigation/native';
import AuthPage from './AuthPage';
import { AuthProvider } from './context/Auth';

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AuthPage />
      </NavigationContainer>
    </AuthProvider>
  );
}
