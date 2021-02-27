// In App.js in a new project

import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { API_URI } from "./config";
import { Transaction, User } from "./types";
import { HomeScreen } from "./screens/HomeScreen";
import { LoginScreen } from "./screens/LoginScreen";
import { ReceiveScreen } from "./screens/ReceiveScreen";
import { SendScreen } from "./screens/SendScreen";
import { AccountScreen } from "./screens/AccountScreen";
import { ChangePasswordScreen } from "./screens/ChangePasswordScreen";
import { Disable2FAScreen } from "./screens/Disable2FAScreen";
import { Enable2FAScreen } from "./screens/Enable2FAScreen";
import { BackupKeysScreen } from "./screens/BackupKeysScreen";
import { RefreshControl } from "react-native";
import { View } from "native-base";
import { ScrollView } from "react-native-gesture-handler";
import { RegisterScreen } from "./screens/RegisterScreen";

const Stack = createStackNavigator<any>();

function App() {
    const [user, setUser] = React.useState<User | null>(null);
    const [balance, setBalance] = React.useState<{
        locked: number;
        unlocked: number;
    } | null>(null);
    const [transactions, setTransactions] = React.useState<
        Transaction[] | null
    >(null);
    const [gotAuthInfo, setGotAuthInfo] = React.useState(false);
    const [prices, setPrices] = React.useState<Record<string, number>>({});
    const [lastFetched, setLastFetched] = React.useState(Date.now());
    const [refreshing, setRefreshing] = React.useState(false);

    const refresh = () => {
        setLastFetched(Date.now());
    };

    const reset = (): void => {
        setUser(null);
        setBalance(null);
        setTransactions(null);
        setGotAuthInfo(false);
    };

    React.useMemo(() => {
        (async (): Promise<void> => {
            try {
                const res = await fetch(`${API_URI}/whoami`, {
                    credentials: "include",
                    method: "GET",
                });
                if (res.status === 200) {
                    setUser(await res.json());
                } else {
                }
            } catch (err) {
                console.warn(err.toString());
            }
            setGotAuthInfo(true);
        })();
    }, []);

    React.useMemo(() => {
        (async (): Promise<void> => {
            if (user === null) {
                return;
            }
            const res = await fetch(`${API_URI}/wallet/balance`, {
                credentials: "include",
                method: "GET",
            });

            if (res.status === 200) {
                setBalance(await res.json());
            }
        })();
    }, [user, lastFetched]);

    React.useMemo(() => {
        if (user === null) {
            return;
        }
        (async (): Promise<void> => {
            const res = await fetch(`${API_URI}/wallet/transactions`, {
                credentials: "include",
                method: "GET",
            });

            if (res.status === 200) {
                setTransactions(await res.json());
            }
        })();
    }, [user, lastFetched]);

    React.useMemo(() => {
        (async (): Promise<void> => {
            if (user === null) {
                return;
            }
            const res = await fetch(`${API_URI}/price`, {
                credentials: "include",
                method: "GET",
            });

            if (res.status === 200) {
                setPrices(await res.json());
            }
        })();
    }, [user, lastFetched]);

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="home" options={{ title: "Home" }}>
                    {(props) => (
                        <HomeScreen
                            {...props}
                            user={user}
                            balance={balance}
                            transactions={transactions}
                            gotAuthInfo={gotAuthInfo}
                            prices={prices}
                            refresh={refresh}
                        />
                    )}
                </Stack.Screen>
                <Stack.Screen name="login" options={{ title: "Login" }}>
                    {(props) => <LoginScreen {...props} setUser={setUser} />}
                </Stack.Screen>
                <Stack.Screen name="receive" options={{ title: "Receive" }}>
                    {(props) => <ReceiveScreen {...props} user={user} />}
                </Stack.Screen>
                <Stack.Screen name="send" options={{ title: "Send" }}>
                    {(props) => (
                        <SendScreen
                            {...props}
                            transactions={transactions}
                            setTransactions={setTransactions}
                        />
                    )}
                </Stack.Screen>
                <Stack.Screen name="account" options={{ title: "Account" }}>
                    {(props) => (
                        <AccountScreen
                            reset={reset}
                            setUser={setUser}
                            {...props}
                            user={user}
                        />
                    )}
                </Stack.Screen>
                <Stack.Screen
                    name="change-password"
                    options={{ title: "Change Password" }}
                >
                    {(props) => (
                        <ChangePasswordScreen setUser={setUser} {...props} />
                    )}
                </Stack.Screen>
                <Stack.Screen
                    name="disable-2fa"
                    options={{ title: "Disable 2FA" }}
                >
                    {(props) => (
                        <Disable2FAScreen setUser={setUser} {...props} />
                    )}
                </Stack.Screen>
                <Stack.Screen
                    name="enable-2fa"
                    options={{ title: "Enable 2FA" }}
                >
                    {(props) => (
                        <Enable2FAScreen setUser={setUser} {...props} />
                    )}
                </Stack.Screen>
                <Stack.Screen name="backup" options={{ title: "Backup Keys" }}>
                    {(props) => (
                        <BackupKeysScreen
                            user={user}
                            setUser={setUser}
                            {...props}
                        />
                    )}
                </Stack.Screen>
                <Stack.Screen name="register" options={{ title: "Register" }}>
                    {(props) => <RegisterScreen setUser={setUser} {...props} />}
                </Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
