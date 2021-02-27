import {
    Container,
    Content,
    Form,
    Input,
    Item,
    View,
    Text,
    Button,
} from "native-base";
import React from "react";
import { Navbar } from "../components/Navbar";
import { API_URI } from "../config";
import { Transaction, User } from "../types";
import { humanToAtomic } from "../utils/humanToAtomic";

const isNumeric = /^[\d+]$/;

export function SendScreen({
    transactions,
    setTransactions,
}: {
    transactions: Transaction[] | null;
    setTransactions: (txs: Transaction[]) => void;
}) {
    const [submitting, setSubmitting] = React.useState(false);
    const [paymentID, setPaymentID] = React.useState("");
    const [address, setAddress] = React.useState("");
    const [amount, setAmount] = React.useState("");

    const submitSend = async (): Promise<void> => {
        setSubmitting(true);
        try {
            const amt = Number.parseInt(amount, 10);
            const res = await fetch(`${API_URI}/wallet/send`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    paymentID,
                    address,
                    amount: humanToAtomic(amt),
                }),
            });
            if (res.status === 200) {
                if (transactions !== null) {
                    const copy = [...transactions];
                    copy.unshift(await res.json());
                    setTransactions(copy);
                    alert("Sent transaction!");
                }
            } else {
                const msg = await res.text();
                if (msg) {
                    alert(msg);
                } else {
                    alert("Something went wrong.");
                }
            }
        } catch (err) {
            alert(err.toString());
        }
        setSubmitting(false);
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
                        Send TRTL
                    </Text>
                    <Form>
                        <Item>
                            <Input
                                value={amount}
                                autoCapitalize={"none"}
                                keyboardType="decimal-pad"
                                onChangeText={(amt) => {
                                    setAmount(amt);
                                }}
                                placeholder="Amount"
                            />
                        </Item>
                        <Item>
                            <Input
                                value={address}
                                autoCapitalize={"none"}
                                onChangeText={(amt) => setAddress(amt)}
                                placeholder="Address"
                            />
                        </Item>
                        <Item last>
                            <Input
                                value={paymentID}
                                autoCapitalize={"none"}
                                onChangeText={(amt) => setPaymentID(amt)}
                                placeholder="PaymentID (Optional)"
                            />
                        </Item>
                    </Form>
                </View>
                <Button
                    onPress={submitSend}
                    block
                    success
                    style={{
                        backgroundColor: "#43b380",
                        marginHorizontal: "5%",
                        marginTop: "8%",
                    }}
                >
                    <Text>Send</Text>
                </Button>
            </Content>
            <Navbar />
        </Container>
    );
}
