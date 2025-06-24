import React, { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";

import PartAnswer from "./PartAnswer";
import styles from "./SectionExplainContentStyle";
import RenderHTML from "react-native-render-html";
import { moderateScale } from "src/config/scale";

type Props = {
    answers: any,
    rationale: string,
};

export default function SectionExplainContent({
    answers = {},
    rationale = '',
}: Props) {
    const [contentWidth, setContentWidth] = useState(0);
    const isHtml = /<\/?[a-z][\s\S]*>/i.test(rationale);
    return (
        <View style={styles.container}>
            <View style={styles.answersContainer}>
                <Text style={styles.rationaleHeader}>
                    {"Correct Answer: "}
                </Text>
                {
                    answers.map((item: any, index: number) => {
                        return (
                            <PartAnswer
                                key={index}
                                index={item.index}
                                content={item.content}
                                correct={item.correct}
                                mine={item.mine}
                                clickable={false}
                                onClick={() => {}}
                            />
                        )
                    })
                }
            </View>
            <View style={styles.quizContainer}
                onLayout={e => setContentWidth(e.nativeEvent.layout.width)}>
                <Text style={styles.rationaleHeader}>
                    {"Answer Explanation:"}
                </Text>
                {isHtml ?
                    <RenderHTML
                        contentWidth={contentWidth}
                        tagsStyles={{
                            p: {
                            fontFamily: 'segoe-ui',
                            fontSize: moderateScale(18),
                            color: '#707070',
                            },
                            span: {
                            fontFamily: 'segoe-ui',
                            fontSize: moderateScale(18),
                            color: '#707070',
                            },
                            strong: {
                            fontFamily: 'segoe-ui',
                            fontSize: moderateScale(18),
                            color: '#707070',
                            },
                        }}
                        source={{ html: rationale}}
                    />
                    :
                    <Text style={styles.questionText}>
                        {`${rationale}`}
                    </Text>
                }
            </View>
        </View>
    )
}