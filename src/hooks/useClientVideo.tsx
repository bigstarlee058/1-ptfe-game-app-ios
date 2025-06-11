import React, { useEffect, useState } from "react";

type VideoData = {
    thumbnailUrl: string;
    videoUrl: string; // Direct video file URL (mp4 or m3u8)
    video: any; // Full video metadata
};

const VIMEO_API_BASE_URL = "https://api.vimeo.com/videos";
const ACCESS_TOKEN = "1db78ccec07239f03f7f3651dec47112"; // Replace with your actual token

export const useClientVideo = (VIMEO_ID: string): VideoData => {
    const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
    const [videoUrl, setVideoUrl] = useState<string>(""); // Direct video file URL
    const [video, setVideo] = useState<any>(null); // Full video metadata
    useEffect(() => {
        const fetchVideoData = async () => {
            try {
                console.log("this is fetcvh", VIMEO_ID);
                const response = await fetch(`${VIMEO_API_BASE_URL}/${VIMEO_ID}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${ACCESS_TOKEN}`,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch video data from Vimeo API");
                }

                const data = await response.json();

                // Extract thumbnail URL
                setThumbnailUrl(data.pictures.sizes[3]?.link || ""); // Adjust index for desired size

                // Extract the highest quality .mp4 file
                const mp4Files = data.files?.filter(
                    (file: any) => file.type === "video/mp4"
                );

                if (mp4Files?.length > 0) {
                    // Sort by resolution (height) and select the best quality
                    const bestFile = mp4Files.sort((a: any, b: any) => b.height - a.height)[0];
                    setVideoUrl(bestFile.link);
                } else if (data.play?.hls?.link) {
                    // Fallback to HLS (.m3u8) if no .mp4 files are available
                    setVideoUrl(data.play.hls.link);
                } else {
                    throw new Error("No playable video URL (mp4 or m3u8) found.");
                }

                setVideo(data); // Save full video metadata
            } catch (err) {
                console.error("Error fetching video data:", err, `${VIMEO_API_BASE_URL}/${VIMEO_ID}`);
                setThumbnailUrl("");
                setVideoUrl("");
                setVideo(null);
            }
        };

        fetchVideoData();
    }, [VIMEO_ID]);

    return { thumbnailUrl, videoUrl, video };
};

