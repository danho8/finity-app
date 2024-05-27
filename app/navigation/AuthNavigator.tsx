import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { authStateSelector } from '../store';
import { useStoreState } from 'easy-peasy';

import LoginScreen from 'app/screens/Login';
import WhiteBar from 'app/components/WhiteBar';
import TermsOfServiceScreen from 'app/screens/TermsOfService';
import RegisterScreen from 'app/screens/Register';
import RegisterSuccessScreen from 'app/screens/RegisterSuccess';
import QueryAccountInformationScreen from 'app/screens/QueryAccountInformation';
import BackBar from 'app/components/BackBar';
import ResultSearchIdScreen from 'app/screens/ResultSearchId';
import ResetPasswordScreen from 'app/screens/ResetPassword';
import InstructionsScreen from 'app/screens/Instructions';
import EditBodyInformationScreen from 'app/screens/EditBodyInformation';

const Stack = createStackNavigator();
const AuthStack = createStackNavigator();

const AuthNavigator = () => {
  const { token } = useStoreState(authStateSelector);

  const [animationTypeForReplace, setAnimationTypeForReplace] = React.useState<"pop" | "push" | undefined>('push');

  React.useEffect(() => {
    token ? setAnimationTypeForReplace('push') : setAnimationTypeForReplace('pop');
  }, [token])

  return (
    <AuthStack.Navigator>
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{
          animationTypeForReplace,
          header: (props) => <WhiteBar />,
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="TermsOfServiceScreen"
        component={TermsOfServiceScreen}
        options={{
          animationTypeForReplace,
          header: (props) => <BackBar />,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{
          animationTypeForReplace,
          header: (props) => <BackBar />,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="RegisterSuccessScreen"
        component={RegisterSuccessScreen}
        options={{
          animationTypeForReplace,
          header: (props) => <BackBar />,
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="QueryAccountInformationScreen"
        component={QueryAccountInformationScreen}
        options={{
          animationTypeForReplace,
          header: (props) => <BackBar />,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="ResultSearchIdScreen"
        component={ResultSearchIdScreen}
        options={{
          animationTypeForReplace,
          header: (props) => <WhiteBar />,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="ResetPasswordScreen"
        component={ResetPasswordScreen}
        options={{
          animationTypeForReplace,
          header: (props) => <BackBar />,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="InstructionsScreen"
        component={InstructionsScreen}
        options={{
          animationTypeForReplace,
          header: (props) => <BackBar />,
          headerShown: false,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="EditBodyInformationScreen"
        component={EditBodyInformationScreen}
        options={{
          animationTypeForReplace,
          header: (props) => <BackBar />,
          gestureEnabled: true,
        }}
      />
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;