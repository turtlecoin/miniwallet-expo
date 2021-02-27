import {
    Button,
    Container,
    Content,
    Form,
    Input,
    Item,
    Text,
} from "native-base";
import React from "react";
import { API_URI } from "../config";
import { User } from "../types";

export function LoginScreen({
    setUser,
    navigation,
}: {
    setUser: (user: User | null) => void;
    navigation: any;
}) {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [collect2FA, setCollect2FA] = React.useState(false);
    const [totp, setTOTP] = React.useState("");

    const login = async (): Promise<void> => {
        if (collect2FA && totp === "") {
            alert("2FA code is required.");
            return;
        }
        const res = await fetch(`${API_URI}/auth`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
                totp,
            }),
        });
        if (res.status === 200) {
            setUser(await res.json());
            navigation.replace("home");
        } else if (res.status === 202) {
            setCollect2FA(true);
        } else if (res.status === 401) {
            alert("Invalid login credentials.");
        } else if (res.status === 403) {
            alert("That 2FA code isn't valid, check your 2FA again.");
        } else {
            alert(await res.text());
        }
    };

    return (
        <Container>
            <Content style={{ marginTop: "10%" }}>
                {!collect2FA && (
                    <Form>
                        <Item>
                            <Input
                                value={username}
                                autoCapitalize={"none"}
                                onChangeText={(username) =>
                                    setUsername(username)
                                }
                                placeholder="Username"
                            />
                        </Item>
                        <Item last>
                            <Input
                                secureTextEntry={true}
                                value={password}
                                onChangeText={(password) =>
                                    setPassword(password)
                                }
                                placeholder="Password"
                            />
                        </Item>
                        <Button
                            onPress={() => {
                                login();
                            }}
                            style={{ margin: "4%", backgroundColor: "#43b380" }}
                            full
                            success
                        >
                            <Text>Login</Text>
                        </Button>
                        <Button
                            onPress={() => {
                                navigation.navigate("register");
                            }}
                            transparent
                            style={{ margin: "4%", marginTop: "0%" }}
                            full
                        >
                            <Text>Sign Up</Text>
                        </Button>
                    </Form>
                )}
                {collect2FA && (
                    <Form>
                        <Item last>
                            <Input
                                value={totp}
                                autoCapitalize={"none"}
                                keyboardType="decimal-pad"
                                onChangeText={(totp) => setTOTP(totp)}
                                placeholder="2FA Code"
                            />
                        </Item>
                        <Button
                            onPress={() => {
                                login();
                            }}
                            style={{ margin: "4%", backgroundColor: "#43b380" }}
                            full
                            success
                        >
                            <Text>Login</Text>
                        </Button>
                    </Form>
                )}
            </Content>
        </Container>
    );
}
