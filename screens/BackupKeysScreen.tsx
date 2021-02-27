import {
    View,
    Text,
    Item,
    Input,
    Form,
    Button,
    Container,
    Content,
    Footer,
} from "native-base";
import * as React from "react";
import { Navbar } from "../components/Navbar";
import { TextFixedWidth } from "../components/TextFixedWidth";
import { API_URI } from "../config";
import { User } from "../types";

export function BackupKeysScreen({
    setUser,
    navigation,
    user,
}: {
    setUser: (user: User) => void;
    user: User | null;
    navigation: any;
}) {
    const [password, setPassword] = React.useState("");
    const [secrets, setSecrets] = React.useState({
        spendKey: "",
        viewKey: "",
    });

    const getSecrets = async (): Promise<void> => {
        const res = await fetch(`${API_URI}/wallet/secrets`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                password,
            }),
        });
        if (res.status === 200) {
            setSecrets(await res.json());
        } else {
            alert("Couldn't get secrets, check your password.");
        }
    };

    if (!user) {
        return <Container />;
    }

    return (
        <Container>
            <Content style={{ padding: "1%", alignContent: "center", flex: 1 }}>
                <View style={{ padding: "4%" }}>
                    {secrets.spendKey == "" && (
                        <View>
                            <Text
                                style={{
                                    fontSize: 18,
                                    marginLeft: "4%",
                                    marginBottom: "3%",
                                }}
                            >
                                Back Up Your Keys
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
                            </Form>
                            <Button
                                block
                                success
                                style={{
                                    backgroundColor: "#43b380",
                                    marginTop: "10%",
                                }}
                                onPress={getSecrets}
                            >
                                <Text>Unlock Private Keys</Text>
                            </Button>
                        </View>
                    )}
                    {secrets.spendKey != "" && (
                        <View>
                            <Text style={{ marginBottom: "3%" }}>
                                Private Spend Key:
                            </Text>
                            <TextFixedWidth>{secrets.spendKey}</TextFixedWidth>
                            <Text
                                style={{ marginBottom: "3%", marginTop: "3%" }}
                            >
                                Private Spend Key:
                            </Text>
                            <TextFixedWidth>{secrets.viewKey}</TextFixedWidth>
                            <Text style={{ marginTop: "6%", color: "#831414" }}>
                                Do not share these keys with anybody. You will
                                lose your funds.
                            </Text>
                        </View>
                    )}
                </View>
            </Content>
            <Navbar />
        </Container>
    );
}
