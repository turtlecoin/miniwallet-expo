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
import { prettyPrintAmount } from "../utils/prettyPrintAmount";

const isNumeric = /^[\d+]$/;

export function SendScreen({
    transactions,
    setTransactions,
    balance,
}: {
    transactions: Transaction[] | null;
    setTransactions: (txs: Transaction[]) => void;
    balance: {unlocked: number, locked: number};
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
                    <View style={{marginBottom: "3%" }}>
                    <Text style={{
                        marginLeft: "4%",
                    }}>
                        Available Balance: {prettyPrintAmount(balance.unlocked + balance.locked)}
                    </Text>
                    {balance.locked > 0 && (
                    <Text
                        style={{
                            color: "#831414",
                            marginTop: "1%",
                            marginLeft: "4%",
                            fontSize: 12,
                            marginBottom: "3%",
                        }}
                    >
                        {prettyPrintAmount(balance.locked)} Locked
                    </Text>
                )}
                </View>

                    <Form>
                        <Item>
                            <Text>Amount</Text>
                            <Input
                                value={amount}
                                autoCapitalize={"none"}
                                keyboardType="decimal-pad"
                                onChangeText={(amt) => {
                                    setAmount(amt);
                                }}
                                placeholder="0.001"
                                style={{ textAlign: "right" }}
                            />
                        </Item>
                        <Item>
                            <Text style={{marginRight: "11%"}}>Address</Text>
                            <Input
                                value={address}
                                autoCapitalize={"none"}
                                onChangeText={(amt) => setAddress(amt)}
                                style={{ textAlign: "right" }}
                                placeholder={"TRTL…HX3"}
                            />
                        </Item>
                        <Item last>
                            <Text>PaymentID</Text>
                            <Input
                                value={paymentID}
                                autoCapitalize={"none"}
                                onChangeText={(amt) => setPaymentID(amt)}
                                placeholder="Optional"
                                style={{ textAlign: "right" }}
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
                    disabled={submitting}
                >
                    <Text>Send</Text>
                </Button>
            </Content>
            <Navbar />
        </Container>
    );
}
