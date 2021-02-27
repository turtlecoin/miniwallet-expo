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
import { API_URI } from "../config";
import { Image } from "react-native";
import { User } from "../types";
import { Navbar } from "../components/Navbar";

interface TOTPRes {
    secret: string;
    qr: string;
}

export function Enable2FAScreen({
    setUser,
    navigation,
}: {
    setUser: (user: User) => void;
    navigation: any;
}) {
    const [qrData, setQrData] = React.useState<TOTPRes | null>(null);
    const [token, setToken] = React.useState("");

    const get2FAKey = async (): Promise<void> => {
        const res = await fetch(`${API_URI}/account/totp/secret`, {
            method: "GET",
            credentials: "include",
        });
        if (res.status === 200) {
            setQrData(await res.json());
        }
    };

    const enroll2FAKey = async (): Promise<void> => {
        const res = await fetch(`${API_URI}/account/totp/enroll`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token,
            }),
        });
        if (res.status === 200) {
            alert("Successfully enrolled in 2FA!");
            const data = await res.json();
            console.log(data);
            setUser(data);
            navigation.navigate("home");
        } else {
            alert("Something went wrong, check your code and try again.");
        }
    };

    return (
        <Container>
            <Content style={{ padding: "5%", alignContent: "center", flex: 1 }}>
                <View>
                    {qrData == null && (
                        <Button
                            style={{
                                marginTop: "5%",
                                backgroundColor: "#43b380",
                            }}
                            block
                            success
                            onPress={() => get2FAKey()}
                        >
                            <Text>Get Secret</Text>
                        </Button>
                    )}
                    {qrData != null && (
                        <View>
                            <View
                                style={{
                                    paddingHorizontal: "17.5%",
                                    marginBottom: "8%",
                                }}
                            >
                                <Image
                                    style={{ width: 200, height: 200 }}
                                    source={{
                                        uri:
                                            "data:image/png;base64," +
                                            qrData.qr,
                                    }}
                                />
                                <Text style={{ marginTop: "5%" }}>
                                    {qrData.secret}
                                </Text>
                            </View>

                            <Text style={{ textAlign: "center" }}>
                                Scan the QR Code or enter it into your
                                authenticator app and submit the code.
                            </Text>

                            <Form style={{ marginTop: "8%" }}>
                                <Item last>
                                    <Input
                                        secureTextEntry={true}
                                        keyboardType={"number-pad"}
                                        value={token}
                                        onChangeText={(password) =>
                                            setToken(password)
                                        }
                                        placeholder="2FA Code"
                                    />
                                </Item>
                            </Form>
                            <Button
                                block
                                style={{
                                    backgroundColor: "#43b380",
                                    marginTop: "8%",
                                }}
                                success
                                onPress={() => {
                                    enroll2FAKey();
                                }}
                            >
                                <Text>Enable 2FA</Text>
                            </Button>
                        </View>
                    )}
                </View>
            </Content>
            <Navbar />
        </Container>
    );
}
