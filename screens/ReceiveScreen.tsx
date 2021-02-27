import { Container, Content, View, Text, Button } from "native-base";
import React, { useRef, useState } from "react";
import { Dimensions, Clipboard, Share } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { Navbar } from "../components/Navbar";
import { TextFixedWidth } from "../components/TextFixedWidth";
import { User } from "../types";
import * as FileSystem from "expo-file-system";

export function ReceiveScreen({ user }: { user: User | null }) {
    const { width, height } = Dimensions.get("window");
    const [qrCode, setQrCode] = useState("");
    let qrRef = useRef(null);

    if (user == null) {
        return <Container />;
    }

    const shareQR = () => {
        if ((qrRef as any).toDataURL) {
            (qrRef as any).toDataURL(async (base64QR: string) => {
                const filename =
                    FileSystem.cacheDirectory + user!.address + ".png";
                await FileSystem.writeAsStringAsync(filename, base64QR, {
                    encoding: FileSystem.EncodingType.Base64,
                });

                await Share.share({ title: "My TRTL Address", url: filename });
            });
        }
    };

    return (
        <Container>
            <Content style={{ padding: "5%", alignContent: "center", flex: 1 }}>
                <View
                    style={{ paddingHorizontal: "22.5%", marginBottom: "8%" }}
                >
                    <QRCode
                        value={user.address}
                        color={"black"}
                        backgroundColor={"white"}
                        size={width * 0.5}
                        getRef={(c) => (qrRef = c)}
                        quietZone={20}
                    />
                </View>
                <Button
                    success
                    onPress={shareQR}
                    block
                    style={{ backgroundColor: "#43b380", marginBottom: "10%" }}
                >
                    <Text>Share QR</Text>
                </Button>

                <View
                    style={{
                        padding: "3%",
                        backgroundColor: "#F5F5F5",
                        marginBottom: "2%",
                    }}
                >
                    <Text style={{ marginBottom: "2%" }}>Address:</Text>
                    <TextFixedWidth>{user.address}</TextFixedWidth>
                    <Button
                        onPress={() => {
                            Clipboard.setString(user.address);
                        }}
                        transparent
                        style={{ marginLeft: "-4%" }}
                    >
                        <Text style={{ color: "#43b380" }}>Copy Address</Text>
                    </Button>
                </View>
            </Content>
            <Navbar />
        </Container>
    );
}
