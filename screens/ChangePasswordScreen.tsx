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

export function ChangePasswordScreen({
    navigation,
    user
}: {
    navigation: any;
    user: User | null;
}) {
    const [oldPassword, setOldPassword] = React.useState("");
    const [newPassword, setNewPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [totp, setTOTP] = React.useState("");

    const changePassword = async (): Promise<void> => {
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        const res = await fetch(`${API_URI}/account/password`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                oldPassword,
                newPassword,
                totp,
            }),
        });
        if (res.status === 200) {
            alert("Your password has been changed.");
            navigation.navigate("home");
        } else {
            alert("There was a problem when changing your password.");
        }
    };

    return (
        <Container>
            <Content style={{ padding: "1%", alignContent: "center", flex: 1 }}>
                <View style={{ padding: "4%" }}>
                    <Form>
                        <Item>
                            <Input
                                secureTextEntry={true}
                                value={oldPassword}
                                onChangeText={(password) =>
                                    setOldPassword(password)
                                }
                                placeholder="Old Password"
                            />
                        </Item>
                        <Item>
                            <Input
                                secureTextEntry={true}
                                value={newPassword}
                                onChangeText={(password) =>
                                    setNewPassword(password)
                                }
                                placeholder="New Password"
                            />
                        </Item>
                        <Item last={user?.twoFactor}>
                            <Input
                                secureTextEntry={true}
                                value={confirmPassword}
                                onChangeText={(password) =>
                                    setConfirmPassword(password)
                                }
                                placeholder="Confirm New Password"
                            />
                        </Item>
                        {user?.twoFactor && <Item last>
                            <Input
                                value={totp}
                                autoCapitalize={"none"}
                                onChangeText={(amt) => setTOTP(amt)}
                                placeholder="2FA Code"
                            />
                            </Item>}
                    </Form>
                    <Button
                        block
                        success
                        style={{ backgroundColor: "#43b380", marginTop: "10%" }}
                        onPress={changePassword}
                    >
                        <Text>Change Password</Text>
                    </Button>
                </View>
            </Content>
            <Navbar />
        </Container>
    );
}
