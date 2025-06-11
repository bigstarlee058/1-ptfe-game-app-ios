import HideIcon from "assets/icons/HideIcon";
import ShowIcon from "assets/icons/ShowIcon";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, View } from "react-native";
import { PTFEEdit } from "src/components/edit";
import styles from "./PartLoginStyle";

type Props = {
    password: string;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
}
console.log("this test");
export default function PartPassword({
    password,
    setPassword,
}: Props) {
    const [hidePassword, setHidePassword] = useState(true);
    return(
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            {/* <PTFEEdit 
                type="password"
                initValue={password}
                onChangeText={setTestPassword}
            /> */}
            <View style={styles.passwordContainer}>
                <TextInput 
                    style={styles.password}
                    secureTextEntry={hidePassword}
                    textContentType={"password"}
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity
                    style={styles.toggleButton}
                    onPress={() => setHidePassword(!hidePassword)}
                >
                    {hidePassword ? <HideIcon /> : <ShowIcon />} 
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}