import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

export function handleBackNavigation(navigation) {
  if (navigation.canGoBack()) {
    navigation.goBack();
  } else {
    navigation.navigate('Home'); // Replace 'Home' with your desired default route
  }
}
