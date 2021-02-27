import {
    Container,
    Content,
    List,
    ListItem,
    Left,
    Right,
    Text,
} from "native-base";
import React, { useMemo, useState } from "react";
import { Platform, RefreshControl } from "react-native";
import { TextFixedWidth } from "../components/TextFixedWidth";
import { User, Transaction } from "../types";
import {
    prettyPrintAmount,
    numberWithCommas,
} from "../utils/prettyPrintAmount";
import { Navbar } from "../components/Navbar";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export function HomeScreen({
    navigation,
    user,
    gotAuthInfo,
    balance,
    transactions,
    prices,
    refresh,
    refreshing,
}: {
    navigation: any;
    user: User | null;
    gotAuthInfo: boolean;
    transactions: Transaction[] | null;
    balance: {
        locked: number;
        unlocked: number;
    } | null;
    prices: Record<string, number>;
    refresh: () => void;
    refreshing: boolean;
}) {
    const onRefresh = React.useCallback(() => {
        refresh();
    }, []);

    useMemo(() => {
        if (gotAuthInfo && user == null) {
            navigation.replace("login");
        }
    }, [gotAuthInfo]);

    if (user == null) {
        return <Container />;
    }

    const fontFamily = Platform.OS === "ios" ? "Courier" : "monospace";
    const total = balance ? balance.unlocked + balance.locked : 0;

    return (
        <Container>
            <Content
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                style={{ padding: "1%", alignContent: "center", flex: 1 }}
            >
                {balance && (
                    <Text
                        style={{
                            fontSize: 32,
                            fontWeight: "500",
                            marginTop: "3%",
                            marginBottom: "5%",
                            marginLeft: "4%",
                        }}
                    >
                        {prettyPrintAmount(total)}
                    </Text>
                )}
                {prices["turtlecoin"] && (
                    <Text
                        style={{
                            marginTop: "-4%",
                            marginBottom: "4%",
                            marginLeft: "4%",
                        }}
                    >
                        {Number(
                            numberWithCommas(
                                Number(
                                    (
                                        prices["turtlecoin"] *
                                        (total / 100)
                                    ).toFixed(2)
                                )
                            )
                        ).toFixed(2)}{" "}
                        USD
                    </Text>
                )}

                {balance && balance.locked > 0 && (
                    <Text
                        style={{
                            color: "#831414",
                            marginLeft: "4%",
                            fontSize: 12,
                            marginBottom: "3%",
                        }}
                    >
                        {prettyPrintAmount(balance.locked)} Locked
                    </Text>
                )}

                <List>
                    <ListItem itemDivider>
                        <Text>Transactions</Text>
                    </ListItem>
                    {transactions &&
                        transactions.map((tx) => {
                            return (
                                <ListItem key={tx.hash} noIndent>
                                    <Left>
                                        <TextFixedWidth>{`${tx.hash.slice(
                                            0,
                                            6
                                        )}…${tx.hash.slice(
                                            tx.hash.length - 6,
                                            tx.hash.length
                                        )}`}</TextFixedWidth>
                                    </Left>
                                    <Right style={{ flex: 1 }}>
                                        {tx.amount > 0 && (
                                            <Text
                                                style={{
                                                    fontVariant: [
                                                        "tabular-nums",
                                                    ],
                                                    textAlign: "right",
                                                    color: "#43b380",
                                                }}
                                            >
                                                +
                                                {prettyPrintAmount(
                                                    tx.amount,
                                                    false
                                                )}
                                            </Text>
                                        )}
                                        {tx.amount < 0 && (
                                            <Text
                                                style={{
                                                    fontVariant: [
                                                        "tabular-nums",
                                                    ],
                                                    textAlign: "right",
                                                    color: "#831414",
                                                }}
                                            >
                                                {prettyPrintAmount(
                                                    tx.amount,
                                                    false
                                                )}
                                            </Text>
                                        )}
                                        <Text
                                            style={{
                                                fontVariant: ["tabular-nums"],
                                                textAlign: "right",
                                                fontSize: 14,
                                                color: "#555",
                                            }}
                                        >
                                            {tx.timestamp
                                                ? new Date(
                                                      tx.timestamp * 1000
                                                  ).toLocaleDateString()
                                                : "Pending"}
                                        </Text>
                                    </Right>
                                </ListItem>
                            );
                        })}
                    {transactions && transactions.length == 0 && (
                        <Text style={{ margin: "5%" }}>
                            You don't have any transactions yet!
                        </Text>
                    )}
                </List>
            </Content>
            <Navbar />
        </Container>
    );
}
