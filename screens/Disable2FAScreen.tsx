import {
    View,
    Text,
    Item,
    Input,
    Form,
    Button,
    Container,
    Content,
} from "native-base";
import * as React from "react";
import { Navbar } from "../components/Navbar";
import { API_URI } from "../config";
import { User } from "../types";

export function Disable2FAScreen({
    setUser,
    navigation,
}: {
    setUser: (user: User) => void;
    navigation: any;
}) {
    const [password, setPassword] = React.useState("");
    const [totp, setTOTP] = React.useState("");

    const disenroll2FAKey = async (): Promise<void> => {
        const res = await fetch(`${API_URI}/account/totp/disenroll`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token: totp,
                password,
            }),
        });
        if (res.status === 200) {
            alert("Successfully removed 2FA!");
            const data = await res.json();
            setUser(data);
            navigation.navigate("home");
        } else {
            alert("Something went wrong, check your code and try again.");
        }
    };

    return (
        <Container>
            <Content style={{ padding: "1%", alignContent: "center", flex: 1 }}>
                <View style={{ padding: "4%" }}>
                    <Text
                        style={{
                            fontSize: 18,
                            marginLeft: "4%",
                            marginBottom: "3%",
                        }}
                    >
                        Disable 2FA
                    </Text>
                    <Form>
                        <Item>
                            <Input
                                secureTextEntry={true}
                                value={password}
                                onChangeText={(password) =>
                                    setPassword(password)
                                }
                                placeholder="Password"
                            />
                        </Item>
                        <Item>
                            <Input
                                secureTextEntry={true}
                                keyboardType={"number-pad"}
                                value={totp}
                                onChangeText={(password) => setTOTP(password)}
                                placeholder="2FA Code"
                            />
                        </Item>
                    </Form>
                    <Button
                        block
                        success
                        style={{ backgroundColor: "#43b380", marginTop: "10%" }}
                        onPress={disenroll2FAKey}
                    >
                        <Text>Disable 2FA</Text>
                    </Button>
                </View>
            </Content>
            <Navbar />
        </Container>
    );
}
