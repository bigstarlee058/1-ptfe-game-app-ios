import React, { useCallback, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Video, ResizeMode } from 'expo-av';

import SectionCategory from "src/sections/Category/SectionCategory";
import styles from "./CategoryStyle";
import SectionHeaderX from "src/sections/Common/SectionHeaderX";
import { LinearGradient } from "expo-linear-gradient";
import { gameModeString } from "src/constants/consts";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { useClientVideo } from "src/hooks/useClientVideo";
const FALLBACK_VIMEO_ID = "1033922649";

type Props = {
    route?: any,
    navigation?: any,
}

export default function Category({
    route,
    navigation,
}: Props) {
    const initialGameMode = route?.params?.gameMode ?? 1;
    const [gameMode, setGameMode] = useState(initialGameMode);
    const player = React.useRef<Video | null>(null); // Type the reference here
    const { user } = useSelector((state: any) => state.userData);
    const [videoId, setVideoId] = useState(FALLBACK_VIMEO_ID);
    const [isBuffering, setIsBuffering] = useState(true);

    useFocusEffect(
        useCallback(() => {
          // Stop the video and reset to the beginning when the page is revisited
          if (player.current) {
            player.current.stopAsync(); // Stop the video
            player.current.replayAsync();
          }
      
          // Fetch the video data again
          const nextGameMode = route?.params?.gameMode ?? initialGameMode;
          setGameMode(nextGameMode);

          const userVideos = Array.isArray(user?.videos) ? user.videos : [];
          const matchedVideo = userVideos.find(
            (video: { title?: string; vimeoId?: string }) =>
              video?.title === gameModeString[nextGameMode] && !!video?.vimeoId
          );

          setVideoId(matchedVideo?.vimeoId ?? FALLBACK_VIMEO_ID);
          setIsBuffering(true);
        }, [initialGameMode, route?.params?.gameMode, user?.videos])
      );
    const { videoUrl } = useClientVideo(videoId);

    const gotoDashboard = useCallback(() => {
        navigation.navigate("Home", {
            screen: "Dashboard",
        });
    }, [navigation]);
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#FF675B', '#87C6E8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 2 }}
                style={styles.upperGradientContainer}
            >
            </LinearGradient>
            <View style={styles.headerContainer}>
                <SectionHeaderX 
                    title={gameModeString[gameMode]}
                    goBack={gotoDashboard}
                />
            </View>
            <View style={styles.vimeoVideoContainer}>
              {isBuffering && (
                <View style={styles.loaderOverlay}>
                  <ActivityIndicator size="large" color="#fff" />
                </View>
              )}
              {
                videoUrl && 
                  <Video
                    ref={player}
                    style={styles.video}
                    source={{uri: videoUrl}}
                    useNativeControls
                    resizeMode={ResizeMode.CONTAIN}
                    isLooping
                    shouldPlay={true}
                    onPlaybackStatusUpdate={status => {
                      if (status.isLoaded) {
                        const buffering =
                          ('isBuffering' in status && status.isBuffering) ||
                          (!status.isPlaying && status.shouldPlay);
                        setIsBuffering(buffering);
                      } else {
                        setIsBuffering(true); // still loading
                      }
                    }}
                  />
              }
            </View>
            <View style={styles.sectionContentSlider}>
                <SectionCategory 
                    gameMode={gameMode} 
                    goBack={gotoDashboard} 
                />
            </View>
        </View>
    );
}
