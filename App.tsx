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
import { RegisterScreen } from "./screens/RegisterScreen";
import * as Font from "expo-font";
import { API } from "./utils/api";

const Stack = createStackNavigator<any>();

function App() {
    const [user, setUser] = React.useState<User | null | undefined>(undefined);
    const [balance, setBalance] = React.useState<{
        locked: number;
        unlocked: number;
    } | null>(null);
    const [transactions, setTransactions] = React.useState<
        Transaction[] | null
    >(null);
    const [prices, setPrices] = React.useState<Record<string, number>>({});
    const [refreshing, setRefreshing] = React.useState(false);

    const refresh = async (): Promise<void> => {
        setRefreshing(true);
        const promises: Array<Promise<any>> = [
            API.prices(),
            API.balance(),
            API.transactions(),
        ];
        try {
            const [prices, balance, transactions] = await Promise.all(promises);
            setTimeout(() => {
                setPrices(prices);
                setBalance(balance);
                setTransactions(transactions);
                setRefreshing(false);
            }, 500);
        } catch (err) {
            setRefreshing(false);
        }
    };

    const reset = (): void => {
        setUser(null);
        setBalance(null);
        setTransactions(null);
    };

    React.useMemo(() => {
        (async (): Promise<void> => {
            const whoami = await API.whoami();
            setUser(whoami);
        })();
    }, []);

    React.useEffect(() => {
        (async () =>
            await Font.loadAsync({
                Roboto: require("native-base/Fonts/Roboto.ttf"),
                Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
            }))();
    }, []);

    React.useMemo(() => {
        (async (): Promise<void> => {
            if (!user) {
                return;
            }

            const balance = await API.balance();
            setBalance(balance);
        })();
    }, [user]);

    React.useMemo(() => {
        (async (): Promise<void> => {
            if (!user) {
                return;
            }

            const transactions = await API.transactions();
            setTransactions(transactions);
        })();
    }, [user]);

    React.useMemo(() => {
        (async (): Promise<void> => {
            if (!user) {
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
    }, [user]);

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="home" options={{ title: "Home" }}>
                    {(props) => (
                        <HomeScreen
                            {...props}
                            user={user || null}
                            balance={balance}
                            transactions={transactions}
                            gotAuthInfo={user !== undefined}
                            prices={prices}
                            refreshing={refreshing}
                            refresh={refresh}
                        />
                    )}
                </Stack.Screen>
                <Stack.Screen name="login" options={{ title: "Login" }}>
                    {(props) => <LoginScreen {...props} setUser={setUser} />}
                </Stack.Screen>
                <Stack.Screen name="receive" options={{ title: "Receive" }}>
                    {(props) => (
                        <ReceiveScreen {...props} user={user || null} />
                    )}
                </Stack.Screen>
                <Stack.Screen name="send" options={{ title: "Send" }}>
                    {(props) => (
                        <SendScreen
                            {...props}
                            balance={balance}
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
                            user={user || null}
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
                            user={user || null}
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
