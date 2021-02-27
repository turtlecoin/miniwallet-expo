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

export function RegisterScreen({
    setUser,
    navigation,
}: {
    setUser: (user: User | null) => void;
    navigation: any;
}) {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirm, setConfirm] = React.useState("");

    const register = async (): Promise<void> => {
        const res = await fetch(`${API_URI}/register`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
            }),
        });
        if (res.status === 200) {
            setUser(await res.json());
            navigation.replace("home");
        } else {
            alert(await res.text());
        }
    };

    return (
        <Container>
            <Content>
                <Form style={{ marginTop: "10%" }}>
                    <Item>
                        <Input
                            value={username}
                            autoCapitalize={"none"}
                            onChangeText={(username) => setUsername(username)}
                            placeholder="Username"
                        />
                    </Item>
                    <Item last>
                        <Input
                            autoCompleteType="password"
                            secureTextEntry={true}
                            value={password}
                            onChangeText={(password) => setPassword(password)}
                            placeholder="Password"
                        />
                    </Item>
                    <Item last>
                        <Input
                            autoCompleteType="password"
                            secureTextEntry={true}
                            value={confirm}
                            onChangeText={(password) => setConfirm(password)}
                            placeholder="Confirm Password"
                        />
                    </Item>
                    <Button
                        onPress={() => {
                            register();
                        }}
                        style={{
                            margin: "4%",
                            marginTop: "8%",
                            backgroundColor: "#43b380",
                        }}
                        full
                        success
                    >
                        <Text>Sign Up</Text>
                    </Button>
                    <Button
                        onPress={() => {
                            navigation.navigate("login");
                        }}
                        transparent
                        style={{ margin: "4%", marginTop: "0%" }}
                        full
                    >
                        <Text>Log In Instead</Text>
                    </Button>
                </Form>
            </Content>
        </Container>
    );
}
