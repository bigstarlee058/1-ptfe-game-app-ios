import { StyleSheet } from "react-native";
import { moderateScale, verticalScale, scale } from "src/config/scale";

export default StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: verticalScale(72),
    },
    title: {
        fontFamily: "circular-std-black",
        fontSize: moderateScale(27),
        color: "#565656",

        marginBottom: verticalScale(28),
    },
    subtitle: {
        fontFamily: "circular-std-black",
        fontSize: moderateScale(18),
        color: "#999999",
        marginBottom: verticalScale(14),
    },
    rememberSection: {
        flexDirection: "row", // Retain row layout in case more elements are added
        justifyContent: "center", // Center content horizontally
        alignItems: "center", // Center content vertically
        marginTop: verticalScale(26),
        marginRight: 6, // Optional: Remove if not needed
    },
    emailContainer: {
        width: "100%",
        height: verticalScale(64),
        paddingRight: scale(8),
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: "#999999",
        borderWidth: moderateScale(1),
        borderRadius: scale(16),
    },
    email: {
        flex: 1,
        paddingTop: 3,
        textAlignVertical: "center",
        paddingHorizontal: scale(16),

        fontFamily: 'poppins-regular',
        color: "#333333",
        fontSize: moderateScale(16),
        // letterSpacing: moderateScale(2),
    },
    passwordContainer: {
        width: "100%",
        height: verticalScale(64),

        flexDirection: 'row',
        alignItems: 'center',
        
        borderColor: "#999999",
        borderWidth: moderateScale(1),
        borderRadius: scale(16),
    },
    password: {
        flex: 1,
        paddingTop: 3,
        textAlignVertical: "center",
        paddingHorizontal: scale(16),

        fontFamily: 'poppins-regular',
        color: "#333333",
        fontSize: moderateScale(16),
        // letterSpacing: moderateScale(2),
    },
    toggleButton: {
        paddingVertical: verticalScale(8),
        paddingHorizontal: scale(10),
    },
    keyboardcontainer: {
        flex: 1,
        justifyContent: 'center',
    },
});