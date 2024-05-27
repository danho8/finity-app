import { Dimensions, Platform, StyleSheet } from "react-native";

const DEFAULT_SPACING = 16;

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  containerDialog:{
    paddingVertical: 34,
    paddingHorizontal: 32,
    backgroundColor: "#FFF",
    borderRadius: 12,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  defaultMargin: {
    margin: DEFAULT_SPACING,
  },
  defaultPadding: {
    padding: DEFAULT_SPACING,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  selfCenter: {
    alignSelf: "center",
  },
  transparent: {
    backgroundColor: "transparent",
  },
  spaceBetween: {
    justifyContent: "space-between",
  },
  boxImage: {
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  input: {
    fontSize: 14,
    color: '#686868',
    borderWidth: 0.5,
    borderColor: '#C1C1C1',
    borderRadius: 5,
    paddingVertical: 10.5,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    lineHeight: 17,
  },
  inputRegister:{
    width:"100%",
    fontSize: 12,
    color: "#686868",
    borderColor: '#C1C1C1',
    borderRadius: 5,
    borderWidth:1,
    fontStyle: 'normal',
    lineHeight: 17,
    paddingVertical: Platform.OS == 'ios' ? 12.5 : 10.5,
    paddingHorizontal: 16,
    backgroundColor:"#FFF",
  },

  button: {
    borderRadius: 5,
  },
  buttonBorder10:{
    backgroundColor: '#DFEDFD',
    borderRadius: 10, 
    marginHorizontal:16,
    marginBottom: 6
  },
  text8Bold: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#686868',
    lineHeight: 11,
  },
  labelButton10:{
    color: '#1E1E1E',
    fontSize: 16,
    paddingVertical: Platform.OS == 'ios' ? 5 : 9.5,
    lineHeight: 17,
  },
  labelButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 0.5,
    paddingVertical: 5,
    textTransform: 'capitalize',
  },
  text10Extra: {
    fontSize: 10,
    color: '#242424',
    lineHeight: 12,
  },
  text10ExtraBold: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#242424',
    lineHeight: 12,
  },
  text14SemiBold: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E1E1E',
    lineHeight: 17,
  },
  text14:{
    fontSize: 14,
    lineHeight: 17,
    color: '#242424',
  },
  text16:{
    fontSize: 16,
    lineHeight: 17,
    color: '#242424',
  },
  text12Regular: {
    fontSize: 12,
    fontWeight: '400',
    color: '#242424',
    lineHeight: 17,
  },
  text9Bold: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#242424',
    lineHeight: 11,
  },
  text9Regular: {
    fontSize: 9,
    fontWeight: '400',
    color: '#242424',
    lineHeight: 11,
  },
  text12Medium: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#242424',
    lineHeight: 15,
  },
  text16Bold: {
    fontSize: 16,
    color: '#242424',
    fontWeight: 'bold',
    lineHeight: 17,
  },
  text18Bold:{
    fontSize: 16,
    color: '#242424',
    fontWeight: 'bold',
    lineHeight: 21,
    textAlign: 'center',
  },
  text16Regular: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#242424',
    lineHeight: 19,
  },
  text16Medium: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#242424',
    lineHeight: 17,
  },
  text16ExtraBold: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#242424',
    lineHeight: 19,
  },
  text20Regular: {
    fontSize: 20,
    fontWeight: '400',
    color: '#242424',
    lineHeight: 30,
  },
  text20Bold: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#242424',
    lineHeight: 30,
  },
  text12SemiBold: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#242424',
    lineHeight: 15,
  },
  text12Bold: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#242424',
    lineHeight: 17,
  },
  textTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#242424',
    lineHeight: 17,
  },
  textList: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#242424',
    lineHeight: 17,
  },
  textUnderline: {
    fontSize: 14,
    textDecorationLine: 'underline',
    lineHeight: 17,
  },
  text14Regular: {
    fontSize: 14,
    fontWeight: '400',
    color: '#242424',
    lineHeight: 19,
  },
  text18Regular: {
    fontSize: 18,
    fontWeight: '400',
    color: '#242424',
    lineHeight: 30,
  },
  text14Medium: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#242424',
    lineHeight: 17,
  },

  
  bottomSheetContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    width: '100%',
    height: '100%',
    zIndex: 999,
    elevation: 999,
  },
  animationContainer: {
    flex: 1,
    flexDirection: 'column-reverse',
    height: '100%',
  },
  bottomSheet: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#fff',
  },
  touchableTransparentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontStyle: 'normal',
    textAlign: "center",
    textTransform: 'uppercase',
    lineHeight: 22, 
    color: '#1E1E1E',
    width: Dimensions.get('screen').width - 100,
  },
  titledialog:{
    fontSize:16,
    fontWeight: '400',
    fontStyle: 'normal',
    textAlign: "center",
    textTransform: 'uppercase',
    lineHeight: 19.2,
    color: '#1E1E1E',
    width: Dimensions.get('screen').width - 100,
  },
  titleSuccess:{
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: "center",
    textTransform: 'uppercase',
    width: Dimensions.get('screen').width - 100,
  },

  inputDisable: {
    backgroundColor: "#E0F2FF",
  },
  header: {
    borderColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 11,
    paddingVertical: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',

  },
  content: {
    borderColor: '#DFEDFD',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingVertical: 6,
    marginBottom: 10,
  },
});


export const customMapStyle =
  [
    {
      featureType: "administrative",
      elementType: "geometry",
      stylers: [
        {
          visibility: "off"
        }
      ]
    },
    {
      featureType: "poi",
      stylers: [
        {
          visibility: "off"
        }
      ]
    },
    {
      featureType: "road",
      elementType: "labels.icon",
      stylers: [
        {
          visibility: "off"
        }
      ]
    },
    {
      featureType: "transit",
      stylers: [
        {
          visibility: "off"
        }
      ]
    },
  ]

