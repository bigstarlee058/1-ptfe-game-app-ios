import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, GestureResponderEvent, PanResponder, Animated, LayoutChangeEvent  } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { useGameMode } from '../../../GameModeContext';
import { Video, ResizeMode, AVPlaybackStatus, AVPlaybackStatusError, AVPlaybackStatusSuccess } from 'expo-av';
import { PTFEButton } from "src/components/button";
import Toast from "react-native-simple-toast";
import { Ionicons } from '@expo/vector-icons'; 
import PartAnswer from "src/parts/Question/PartAnswer";
import styles from "./SectionMainContentStyle";
import { WebView } from 'react-native-webview';
// import Video from 'react-native-video';
import { getQuizDataDetail } from "src/actions/quiz/quiz";
import { moderateScale, scale, verticalScale } from "src/config/scale";
import { PTFELoading } from "src/components/loading";
import { quiz_test_data } from "assets/@mockup/data";
import {
  gameModeString,
  survivalLife,
  timeLimitPerQuestion,
} from "src/constants/consts";

import TickAnim from "src/parts/Question/TickAnim";
import CloseAnim from "src/parts/Question/CloseAnim";
import { checkIfUserHastakenQuizToday, sleep } from "src/utils/util";

import { quizModes } from "src/constants/consts";
import { getAllQuestions } from "src/actions/question/question";
import { useSelector } from "react-redux";
import { useVideo } from "src/hooks/useVideo";
import { useClientVideo } from "src/hooks/useClientVideo";

type Answer = {
  questionId: string;
  isCorrect: boolean;
};

type Props = {
  quizID: string[];
  refresh: boolean;
  setCurrentProbNumber: (newValue: number) => void;
  setDataLoadedFlag: (newValue: boolean) => void;
  setCurrentLife: (newValue: number) => void;
  setCurrent: (newValue: number) => void;
  setTotalProbCount: (newValue: number) => void;
  timerPaused: boolean;
  scrollRef: any;
  setCurrentQuizState: (newValue: number) => void;
  topic: string[]
};

const isAVPlaybackStatusSuccess = (status: AVPlaybackStatus | null): status is AVPlaybackStatusSuccess => {
  return status !== null && 'isPlaying' in status;
};

export default function SectionMainContent({
  quizID,
  refresh,
  setCurrentProbNumber,
  setDataLoadedFlag,
  setCurrentLife,
  setCurrent,
  setTotalProbCount,
  timerPaused,
  scrollRef,
  setCurrentQuizState,
  topic
}: Props) {
  const navigation: any = useNavigation();
  const {setsubmitState, setCategoryState, setSetCategoryState} = useGameMode();

  const { user } = useSelector((state: any) => state.userData);

  const [submitData, setSubmitData] = useState<any[]>([]);

  const [life, setLife] = useState(survivalLife);
  const [quizState, setQuizState] = useState(0);

  const [quizData, setQuizData] = useState<any>({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [testEnded, setTestEnded] = useState(false);

  const [probCount, setProbCount] = useState(0);
  const [currentProb, setCurrentProb] = useState(0);
  const [passedQuestion, setPassedQuestionCount] = useState(0);

  const [currentScore, setCurrentScore] = useState(0);

  const [statistics, setStatistics] = useState<number>(0);

  const [submitAnswers, setSubmitAnswers] = useState<Answer[]>([]);

  const [problem, setProblem] = useState<string>("");
  const [answers, setAnswers] = useState<any>([0, 0, 0, 0]);
  const [rationale, setRationale] = useState<string>("");
  const [statisticsFlag, setStatisticsFlag] = useState(false);

  const [limitTime, setLimitTime] = useState(0);
  const [remainTime, setRemainTime] = useState(0);

  const [tickShow, setTickShow] = useState(false);
  const [closeShow, setCloseShow] = useState(false);

  const [hideTick, setHideTick] = useState(true);
  const [hide, setHide] = useState(true);

  const [selected, setSelected] = useState(false);

  const [paused, setPaused] = useState(false);

  const [image, setImage] = useState("");

  const [videoId, setVideoId] = useState("");

  const player = React.useRef<Video | null>(null); // Type the reference here
  const [status, setStatus] = useState<AVPlaybackStatus | AVPlaybackStatusError | null>(null);
  useEffect(() => {
    if (quizID == undefined) {
      return;
    }

    setLife(survivalLife);

    setDataLoadedFlag(false);
    setSubmitData([]);
    setQuizData({});

    setDataLoaded(false);
    setTestEnded(false);

    setProbCount(0);
    setCurrentProb(0);
    setCurrentScore(0);
    setCurrent(0);
    setProblem("");
    setAnswers([0, 0, 0, 0]);
    setSelected(false);

    fetchQuizDetail();
  }, []);

  useFocusEffect(React.useCallback(() => {}, [quizID, refresh]));
  const goToSetting = useCallback(() => {
    // navigation.navigate("Profile", {
    //   screen: "SettingScreen",
    // });
    navigation.navigate("Profile", {
      screen: "Billing",
      params: { home: false, userid: user._id, isFromRegister: false },
    });
  }, [navigation]);

  const fetchQuizDetail = useCallback(async () => {
    const data = await getAllQuestions(quizID);
    
    if (data.success == false) {
      if (setCategoryState === 1) {
        Toast.show(
          "Your game is only available on paid accounts. Subscribe to your account",
          Toast.SHORT 
        );
        goToSetting();
      }
    }
    if (data.state == true) {
      if (setCategoryState === 1) {
        Toast.show(
          "Your subscription expired, Please purchase.",
          Toast.SHORT 
        );
        goToSetting();
      }
    }
    if (data.state == true) {
      if (setCategoryState === 1) {
        Toast.show(
          "Your subscription expired, Please purchase.",
          Toast.SHORT 
        );
        goToSetting();
      }
    }
    // await sleep(500);
    const statistics = data.questions[currentProb]?.statistics;
    if (statistics) {
      const totalCorrect = statistics.totalCorrect || 0;
      const totalAnswered = statistics.totalAnswered || 1;
      const percentageCorrect = (totalCorrect / totalAnswered) * 100;
      if (Math.round(percentageCorrect) == 0) {
        setStatistics(Math.floor(Math.random() * (90 - 70 + 1)) + 70)
      } else {
        setStatistics(Math.round(percentageCorrect));
      }     
    }
    setQuizData(data);
    setDataLoaded(true);
    setSubmitData([]);
    setDataLoadedFlag(true);
  }, [setQuizData, setDataLoaded, setSubmitData, setDataLoadedFlag, quizID]);

  useEffect(() => {
    setProbCount(quizData?.questions?.length);
    setCurrentProb(currentProb);
  }, [quizData, currentProb]);

  useEffect(() => {
    if (dataLoaded && quizData.questions?.length) {
      setCurrentProbNumber(currentProb + 1);
      setTotalProbCount(probCount);

      setRemainTime(timeLimitPerQuestion);
      setLimitTime(timeLimitPerQuestion);

      const currentQuestion = quizData.questions[currentProb];
      const statistics = quizData.questions[currentProb + 1]?.statistics;
      if (statistics) {
        const totalCorrect = statistics.totalCorrect || 0;
        const totalAnswered = statistics.totalAnswered || 1;
        const percentageCorrect = (totalCorrect / totalAnswered) * 100;
        if (Math.round(percentageCorrect) == 0) {
          setStatistics(Math.floor(Math.random() * (90 - 70 + 1)) + 70)
        } else {
          setStatistics(Math.round(percentageCorrect));
        }     
      }
      if (currentQuestion) {
        console.log("this is classic page", currentQuestion.image, currentQuestion.vimeoId);
        setProblem(currentQuestion.question);
        if(currentQuestion.image) {
          setImage(currentQuestion.image);
        } else {
          setImage("");
        }
        if(currentQuestion.vimeoId) {
          setVideoId(currentQuestion.vimeoId);
        } else {
          setVideoId("");
        }
        setRationale(currentQuestion.answerExplanation);
        if (currentQuestion.answers) {
          const newAnswers = currentQuestion.answers.map(
            (item: any, index: number) => {
              return {
                index: String.fromCharCode(0x41 + index),
                content: item.answer,
                enabled: false,
                correct: item.correct,
              };
            }
          );
          setAnswers(newAnswers);
        }
      }
    }
  }, [currentProb, dataLoaded, quizData, setLimitTime, setRemainTime]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (paused || testEnded) {
        clearInterval(intervalId);
      } else {
        if (remainTime <= 0 && dataLoaded) {
          goSubmit();
          NextClicked()
        } else {
          setRemainTime(remainTime - 100);
        }
      }
    }, 100);

    return () => {
      clearInterval(intervalId);
    };
  }, [remainTime, testEnded, dataLoaded, paused]);

  useEffect(() => {
    setPaused(timerPaused);
  }, [timerPaused]);

  const goSubmit = useCallback(() => {
    updateSubmitData();
    setStatisticsFlag(true);

    if (quizState == 0) {
      // Update Submit Data Start
      let isPassed = false;
      for (const answer of answers) {
        if (answer.enabled == true && answer.correct == true) {
          setPassedQuestionCount(passedQuestion + 1);
          isPassed = true;
        }
      }

      if (!isPassed) {
        setCloseShow(true);
        // setHide(false);
      } else {
        // setTickShow(true);
        // setHideTick(false);

        const newScore: number = Math.floor(
          currentScore +
            (100 + remainTime / 1000) *
              (user?.currentMultiplier == undefined
                ? 1
                : user?.currentMultiplier)
        );
        setCurrentScore(newScore);
        setCurrent(newScore);
      }
      setQuizState(2);
      setCurrentQuizState(2);
    }
    // Update Submit Data End
  }, [
    answers,
    life,
    submitData,
    currentProb,
    probCount,
    navigation,
    setLife,
    setCurrentLife,
    setCurrentProb,
    setTestEnded,
  ]);

  const updateSubmitData = useCallback(() => {
    let data = submitData;
    let newItem = {
      id: quizData.questions[currentProb]._id,
      question: problem,
      answers: "",
      answerExplanation: rationale,
    };
    newItem.answers = answers;
    data.push(newItem);
    setSubmitData(data);
  }, [
    quizData,
    problem,
    rationale,
    currentProb,
    answers,
    submitData,
    setSubmitData,
  ]);
  const convertImageUrl = (url: string) => {
    return url.replace(
      "https://storage.cloud.google.com",
      "https://storage.googleapis.com"
    );
  };
  

  const goNext = () => {
    if (quizState) NextClicked();
  };

  const NextClicked = useCallback(() => {
    setsubmitState(1);
    setStatisticsFlag(false);
    // updateSubmitData();
    setQuizState(0);
    setCurrentQuizState(0);
    setSetCategoryState(1);
    if (currentProb + 1 >= quizData?.questions?.length) {
      setTestEnded(true);
      const keys = Object.keys(quizModes);
      const index = keys.indexOf("classicMode");
      const hasTakenQuizToday = checkIfUserHastakenQuizToday(user);

      if (hasTakenQuizToday) {
        navigation.navigate("Score", {
          id: quizID,
          submitData: submitData,
          title: gameModeString[index],
          score: currentScore,
          quizMode: quizModes.classicMode,
          numberOfQuestions: currentProb + 1,
          answers: submitAnswers,
          topic: topic
        });
      } else if (user.uid == -1) {
        navigation.navigate("Score", {
          id: quizID,
          submitData: submitData,
          title: gameModeString[index],
          score: currentScore,
          quizMode: quizModes.classicMode,
          numberOfQuestions: currentProb + 1,
          answers: submitAnswers,
          topic: topic
        });
      } else {
        navigation.navigate("CurrentStreak", {
          id: quizID,
          submitData: submitData,
          title: gameModeString[index],
          score: currentScore,
          quizMode: quizModes.classicMode,
          numberOfQuestions: currentProb + 1,
          answers: submitAnswers,
          topic: topic
        });
      }
    } else {
      setCurrentProb(currentProb + 1);
      setSelected(false);

      scrollRef.current?.scrollTo({
        y: 0,
        animated: true,
      });
    }
  }, [
    navigation,
    setTestEnded,
    currentProb,
    currentScore,
    survivalLife,
    setCurrentProb,
    setSelected,
    
  ]);

  const onSelect = useCallback(
    (idx: number) => {
      const incrementMatch = answers[idx].correct === true ? 1 : 0;

      const id = quizData.questions[currentProb + 1]?._id;
      const unitAnswer = {
        questionId: id,
        isCorrect: incrementMatch === 1,
      };

      setSubmitAnswers([...submitAnswers, unitAnswer]);

      const newAnswers = answers.map((item: any, index: number) => {
        return {
          index: item.index,
          content: item.content,
          enabled: index == idx,
          correct: item.correct,
        };
      });
      setAnswers(newAnswers);
      setSelected(true);

      scrollRef.current?.scrollToEnd({
        animated: true,
      });
    },
    [answers, setAnswers, setSelected, scrollRef]
  );
  const {thumbnailUrl, videoUrl, video} = useClientVideo(videoId);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [didFinish, setDidFinish] = useState(false);
  const [progress, setProgress] = useState(0); // Track progress
  const [duration, setDuration] = useState(0); // Track duration
  const [barWidth, setBarWidth] = useState(0); // To track the width of the progress bar
  const progressBarWidth = useRef(new Animated.Value(0)).current; 
  const [stopStatus, setStopStatus] = useState(false);

  const handlePlay = () => {
    if (player.current) {
      player.current.playAsync();
      setIsVideoPlaying(true);
      setDidFinish(false);
      setStopStatus(false);
    }
  };

  const handleReplay = () => {
    if (player.current) {
      player.current.replayAsync();
      setIsVideoPlaying(true);
      setDidFinish(false);
    }
  };
  const handlePause = () => {
    if (player.current) {
      player.current.stopAsync();
      setIsVideoPlaying(false);
      setDidFinish(true);
    }
  };

  const handleStatusUpdate = (status: AVPlaybackStatus) => {
    setStatus(status);

    // Track progress and duration
    if (isAVPlaybackStatusSuccess(status)) {
      if (status.isPlaying) {
        setIsVideoPlaying(true);
      }

      // When video finishes, set didFinish to true
      if (status.didJustFinish) {
        setDidFinish(true);
        setIsVideoPlaying(false);
      }

      if (status.durationMillis) {
        setDuration(status.durationMillis); // Update duration
      }
      if (status.positionMillis && status.durationMillis) {
        setProgress(status.positionMillis / status.durationMillis); // Calculate progress as a fraction
        Animated.timing(progressBarWidth, {
          toValue: (status.positionMillis / status.durationMillis) * 100, // Update progress bar width
          duration: 100,
          useNativeDriver: false,
        }).start();
      }
    }
  };

  const handleSeek = (e: GestureResponderEvent) => {
    // Calculate where the user tapped on the progress bar
    const newPosition = e.nativeEvent.locationX / barWidth;
    const newTime = newPosition * duration;
    if (player.current) {
      player.current.setPositionAsync(newTime); // Seek to the new position
    }
  };

  const handleLayout = (e: { nativeEvent: { layout: { width: any; }; }; }) => {
    const width = e.nativeEvent.layout.width; // Get the width of the progress bar
    setBarWidth(width); // Update the barWidth state with the new width
  };
  const handleStop = () => {
    if (player.current) {
      player.current.pauseAsync();
      setIsVideoPlaying(false); // Stop the video
      setStopStatus(true)
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <AnimatedCircularProgress
          size={verticalScale(90)}
          width={verticalScale(8)}
          fill={
            limitTime != 0 ? ((limitTime - remainTime) * 100) / limitTime : 0
          }
          tintColor="#FFFFFFFF"
          rotation={180}
          backgroundColor="#87C6E8"
        >
          {(fill) => (
            <Entypo name="stopwatch" size={moderateScale(36)} color="#A1C2C8" />
          )}
        </AnimatedCircularProgress>
      </View>
      <View style={styles.innerContainer}>
        <View style={styles.quizContainer}>
          <ScrollView>
            <Text style={styles.questionText}>
              {problem.replace(/\n/g, "").trim()}
            </Text>
            {
              videoId?
              <View style={styles.videoWrapper}>
                <Video
                    ref={player}
                    style={styles.video}
                    source={{
                    uri: videoUrl,
                    }}
                    useNativeControls={false}
                    // resizeMode={ResizeMode.CONTAIN}
                    isLooping={false}
                    shouldPlay={true}
                    onPlaybackStatusUpdate={handleStatusUpdate} 
                    // onPlaybackStatusUpdate={status => setStatus(() => status)}
                />
                {!didFinish && !isVideoPlaying && (
                  <TouchableOpacity style={styles.controlPlayButton} onPress={handlePlay}>
                    <Ionicons name="play" size={60} color="#fff" />
                  </TouchableOpacity>
                )} 
                {
                  didFinish || isVideoPlaying ? 
                <View style={styles.controlsRow}>
                {
                  <TouchableOpacity style={styles.controlButton} onPress={handlePause}>
                    <Ionicons name="stop" size={30} color="#fff" /> 
                  </TouchableOpacity>
                }
                {
                  isVideoPlaying?           
                  <TouchableOpacity style={styles.controlButton} onPress={handleStop}>
                    <Ionicons name="pause" size={30} color="#fff" />
                  </TouchableOpacity> :
                  <TouchableOpacity style={styles.controlButton} onPress={handlePlay}>
                    <Ionicons name="play" size={30} color="#fff" />
                  </TouchableOpacity>
                }
                {
                  <TouchableOpacity style={styles.controlButton} onPress={handleReplay}>
                    <Ionicons name="reload" size={30} color="#fff" /> 
                  </TouchableOpacity>
                }
                </View>: null                  
                }
                
                {isVideoPlaying || stopStatus?<View style={styles.progressWrapper}>
                  <View
                    style={styles.progressBar}
                    onStartShouldSetResponder={() => true} // Enable touch handling
                    onResponderMove={handleSeek} // Capture touch movements on the progress bar
                    onLayout={handleLayout} // Get layout width for the progress bar
                  >
                    <Animated.View
                      style={[
                        styles.progress,
                        {
                          width: progressBarWidth.interpolate({
                            inputRange: [0, 100],
                            outputRange: ['0%', '100%'],
                          }),
                        },
                      ]}
                    />
                  </View>
                </View>:null}
              </View>: null
            }
            {
              image?             
              <View style={styles.photoContainer}>
                <Image
                  style={styles.image}
                  source={
                    {uri: image}
                  }
                />
              </View> : null
            }

          </ScrollView>
        </View>
        {statisticsFlag && (
          <View style={styles.statisticsContainer}>
            <Text style={styles.statisticsText}>
              {statistics} % of users answer this question correctly
            </Text>
          </View>
        )}
        <View style={styles.answersContainer}>
          {answers.map((item: any, index: number) => {
            return (
              <>
                {quizState == 0 ? (
                  <PartAnswer
                    key={index}
                    index={item.index}
                    content={item.content}
                    enabled={item.enabled}
                    clickable={hide && hideTick}
                    onClick={() => onSelect(index)}
                  />
                ) : (
                  <PartAnswer
                    key={index}
                    index={item.index}
                    content={item.content}
                    enabled={item.enabled}
                    correct={item.correct}
                    mine={item.enabled}
                    clickable={false}
                    onClick={() => onSelect(index)}
                  />
                )}
              </>
            );
          })}
        </View>
        <View style={styles.buttonContainer}>
          {quizState == 2 ? (
            <PTFEButton
              text={"Next"}
              type={"rounded"}
              color="#FF675B"
              enabled={!selected}
              onClick={goNext}
            />
          ) : (
            <PTFEButton
              text={"Submit"}
              type={"rounded"}
              color="#FF675B"
              enabled={!selected}
              onClick={goSubmit}
            />
          )}
        </View>
      </View>
    </View>
  );
}
