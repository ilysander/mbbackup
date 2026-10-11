import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SamplingTab from '../scenes/demo/SamplingTab';
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import BottomTabBar from '../components/navigation/BottomTabBar';
import QueriesRouter from './v2/app/QueriesRouter';
import TransfersRouter from './v2/app/TransfersRouter';
import LoansRouter from './v2/app/LoansRouter';
import PaymentsRouter from './v2/app/PaymentsRouter';
import ForyouRouter from './v2/app/ForyouRouter';
import { L } from '../resources/language';

// Tab Personallizado
function MyTabBar(props: BottomTabBarProps) {
  return <BottomTabBar {...props} />;
}

const Tab = createBottomTabNavigator();
const HomeTabBottomRouter = function HomeTabBottomRouter() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props: BottomTabBarProps) => <MyTabBar {...props} />}
    >
      {/* <Tab.Screen name="Queries">
        {(props: any) => <QueriesRouter name={'Queries'} {...props} />}
      </Tab.Screen>
      <Tab.Screen
        name="Transfers"
      >
        {(props: any) => <TransfersRouter name={'Transfers'} {...props} />}
      </Tab.Screen>
      <Tab.Screen name="Payments">
        {(props: any) => <PaymentsRouter name={'Payments'} {...props} />}
      </Tab.Screen>
      <Tab.Screen name="Loans">
        {(props: any) => <LoansRouter name={'Loans'} {...props} />}
      </Tab.Screen>
      <Tab.Screen name="Foryou">
        {(props: any) => <ForyouRouter name={'Foryou'} {...props} />}
      </Tab.Screen> */}

      <Tab.Screen name='Queries' component={QueriesRouter} options={{tabBarLabel:L.bottombar_queries_title, tabBarAccessibilityLabel:'queriesscreen_tab'}} />
      <Tab.Screen name='Transfers' component={TransfersRouter} options={{tabBarLabel:L.bottombar_transfers_title, tabBarAccessibilityLabel:'transactionsscreen_tab'}} />
      <Tab.Screen name='Payments' component={PaymentsRouter} options={{tabBarLabel:L.bottombar_payments_title, tabBarAccessibilityLabel:'paymentsscreen_tab'}} />
      <Tab.Screen name='Loans' component={LoansRouter} options={{tabBarLabel:L.bottombar_loans_title, tabBarAccessibilityLabel:'loansscreen_tab'}} />
      <Tab.Screen name='Foryou' component={ForyouRouter} options={{tabBarLabel:L.bottombar_foryou_title, tabBarAccessibilityLabel:'foryou_tab'}} />
    </Tab.Navigator>
  );
};

const Stack = createNativeStackNavigator();

function AppRouter() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={HomeTabBottomRouter} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Search" component={SamplingTab} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

export default AppRouter;
