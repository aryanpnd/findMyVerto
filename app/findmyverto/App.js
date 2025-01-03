import { NavigationContainer } from '@react-navigation/native';
import AuthPage from './AuthPage';
import { AuthProvider } from './context/Auth';
import { AppProvider } from './context/MainApp';

export default function App() { 
  return (
    <AuthProvider>
      <AppProvider>
      <NavigationContainer>
        <AuthPage />
      </NavigationContainer>
      </AppProvider>
    </AuthProvider>
  );
}
