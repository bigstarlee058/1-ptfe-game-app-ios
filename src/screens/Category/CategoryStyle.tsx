import { StyleSheet, Dimensions } from 'react-native';
import { moderateScale, scale, verticalScale } from 'src/config/scale';

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: "#FFDFFF",
  },
  upperGradientContainer: {
    position: "absolute",
    width: "100%",
    height: windowHeight * 84 / 93,
  },
  headerContainer: {
    height: windowHeight * 8 / 93,
    flexDirection: "column",
    justifyContent: 'flex-end',
    width: "100%",
  },
  sectionContentSlider: {
    width: '100%',
  },
  vimeoVideoContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: '80%',
    height: verticalScale(450),
    borderRadius: moderateScale(12),
    // backgroundColor: "grey",
    marginTop: moderateScale(8),
    position: "relative",
  },
  video: {
    width: '100%',
    height: verticalScale(450),
  },
  loaderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0)", // semi-transparent black
    borderRadius: moderateScale(12),
    zIndex: 10,
  },
})