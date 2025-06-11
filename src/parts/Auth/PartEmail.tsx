import NinjaEmailIcon from "assets/icons/NinjaEmailIcon";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, TextInput, View } from "react-native";
import { PTFEEdit } from "src/components/edit";
import styles from "./PartLoginStyle";

type Props = {
    email: string;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
}
console.log("this test");
export default function PartEmail({
    email,
    setEmail
}: Props) {
    const [testEmail, setTestEmail] = useState("");
    return(
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            {/* <PTFEEdit 
                type="email"
                initValue={email}
                onChangeText={setTestEmail}
            /> */}
            <View style={styles.emailContainer}>
                <TextInput 
                    style={styles.email}
                    value={email}
                    onChangeText={setEmail}
                />
                <NinjaEmailIcon />
            </View>
        </KeyboardAvoidingView>
    );
}