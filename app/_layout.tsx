import {Tabs} from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function Layout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#ffd33d',
                headerStyle: {
                    backgroundColor: '#25292e',
                },
                headerShadowVisible: false,
                headerTintColor: '#fff',
                tabBarStyle: {
                    backgroundColor: '#25292e',
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({color, focused}) => (
                        <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="tasks/index"
                options={{
                    tabBarLabel: "Tasks",
                    tabBarIcon: ({color, focused}) => (
                        <FontAwesome name={focused ? 'tasks' : 'th-list'} size={24} color={color}/>
                    ),
                }}

            />
        </Tabs>


    );
}
