import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import { moderateScale, scale, verticalScale } from 'src/config/scale';
import { PTFEButton } from '../button';
import { FontAwesome5 } from '@expo/vector-icons';

import styles from './QuestionOptionModalStyle';
import SelectDropdown from 'react-native-select-dropdown';
import { PTFEEdit } from '../edit';

type Props = {
    issuereportModalVisible: boolean;
    setIssueReportModalVisible: (newValue: boolean) => void; 
    onReportQuestion: (newValue: any) => void;
}

const IssueReportModal = ({ 
    issuereportModalVisible, 
    setIssueReportModalVisible, 
    onReportQuestion 
}: Props) => {
    const [content, setContent] = useState('');
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={issuereportModalVisible}
            onRequestClose={() => setIssueReportModalVisible(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={{ 
                        fontSize: moderateScale(20), 
                        textAlign: 'center', 
                        fontFamily: 'circular-std-medium', 
                        paddingBottom: verticalScale(16) }}
                    >
                        Report an issue
                    </Text>

                    <View style={styles.container}>
                        <PTFEEdit 
                            type="multiline"
                            initValue={content}
                            onChangeText={setContent}
                            height={verticalScale(250)}
                        />
                    </View>

                    <View style={styles.space1}>
                        <View style={styles.buttonContainer}>
                            <PTFEButton 
                                text="Close"
                                type="rounded"
                                color="#87C6E8"
                                onClick={() => {
                                    setIssueReportModalVisible(false);
                                }}
                                height={scale(48)}
                            />
                        </View>
                        <View style={styles.buttonContainer}>
                            <PTFEButton 
                                text="Report"
                                type="rounded"
                                color="#FF675B"
                                onClick={() => {
                                    setIssueReportModalVisible(false);
                                    onReportQuestion(content);
                                }}
                                height={scale(48)}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default IssueReportModal;
