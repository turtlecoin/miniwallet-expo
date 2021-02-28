import * as React from "react";
import { Button, Footer, FooterTab, Text } from "native-base";
import { useNavigation } from "@react-navigation/native";

export function Navbar() {
    const navigation = useNavigation();
    const state = navigation.dangerouslyGetState();
    const { index } = state;
    const goTo = navigation.navigate;
    return (
        <Footer>
            <FooterTab  style={{ backgroundColor: "#43b380" }}>
                <Button
                    transparent
                    style={{ backgroundColor: "#43b380" }}
                    onPress={() => goTo("home")}
                >
                    <Text style={{ color: "#FFF" }}>Home</Text>
                </Button>
                <Button
                    style={{ backgroundColor: "#43b380" }}
                    onPress={() => goTo("send")}
                >
                    <Text style={{ color: "#FFF" }}>Send</Text>
                </Button>
                <Button
                    style={{ backgroundColor: "#43b380" }}
                    onPress={() => goTo("receive")}
                >
                    <Text style={{ color: "#FFF" }}>Receive</Text>
                </Button>
                <Button
                    style={{ backgroundColor: "#43b380" }}
                    onPress={() => goTo("account")}
                >
                    <Text style={{ color: "#FFF" }}>Account</Text>
                </Button>
            </FooterTab>
        </Footer>
    );
}
