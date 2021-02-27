import { useNavigation } from "@react-navigation/native";
import {
    Button,
    Container,
    Content,
    View,
    Text,
    List,
    ListItem,
    Item,
    Form,
    Input,
} from "native-base";
import React, { useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import { Navbar } from "../components/Navbar";
import { TextFixedWidth } from "../components/TextFixedWidth";
import { API_URI } from "../config";
import { User } from "../types";

interface TOTPRes {
    secret: string;
    qr: string;
}

export function AccountScreen({
    user,
    setUser,
    reset,
}: {
    user: User | null;
    setUser: (user: User) => void;
    reset: () => void;
}) {
    const navigation = useNavigation();

    const logout = async (): Promise<void> => {
        reset();
        await fetch(`${API_URI}/logout`, {
            method: "POST",
            credentials: "include",
        });
        if (navigation.canGoBack()) {
            (navigation as any).popToTop();
        }
        (navigation as any).replace("login");
    };

    if (user == null) {
        return <Container />;
    }

    return (
        <Container>
            <Content style={{ padding: "1%", alignContent: "center", flex: 1 }}>
                <View style={{ padding: "0%" }}>
                    <List>
                        <ListItem itemDivider>
                            <Text>Security</Text>
                        </ListItem>
                        <ListItem>
                            <Button
                                transparent
                                small
                                onPress={() =>
                                    navigation.navigate("change-password")
                                }
                            >
                                <Text>Change Password</Text>
                            </Button>
                        </ListItem>
                        {!user.twoFactor && (
                            <ListItem>
                                <Button
                                    transparent
                                    small
                                    onPress={() =>
                                        navigation.navigate("enable-2fa")
                                    }
                                >
                                    <Text>Enable 2FA</Text>
                                </Button>
                            </ListItem>
                        )}

                        {user.twoFactor && (
                            <ListItem>
                                <Button
                                    transparent
                                    small
                                    onPress={() =>
                                        navigation.navigate("disable-2fa")
                                    }
                                >
                                    <Text>Disable 2FA</Text>
                                </Button>
                            </ListItem>
                        )}
                        <ListItem itemDivider>
                            <Text>Wallet</Text>
                        </ListItem>
                        <ListItem>
                            <Button
                                transparent
                                small
                                onPress={() => navigation.navigate("backup")}
                            >
                                <Text>Backup Private Keys</Text>
                            </Button>
                        </ListItem>
                        <ListItem itemDivider>
                            <Text>Account</Text>
                        </ListItem>
                        <ListItem>
                            <Button transparent small onPress={logout}>
                                <Text>Log Out</Text>
                            </Button>
                        </ListItem>
                    </List>
                </View>
            </Content>
            <Navbar />
        </Container>
    );
}
