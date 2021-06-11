import { StyleSheet,Dimensions} from 'react-native';

const deviceWidth = Dimensions.get('window').width

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#153084',
      alignItems: 'center',
      justifyContent: 'center',
    },
    cameraView: {
      display: 'flex',
      flex:1,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
      width: '100%',
      height: '100%',
      paddingTop: 10
    },
    camera : {
      width: 700/2,
      height: 800/2,
      zIndex: 1,
      borderWidth: 0,
      borderRadius: 0,
    },
    image:{
        width:150,
        height:150,
      },
      horizontal:{
        alignItems: 'center',
        justifyContent: 'center',
      },
      barContainer: {
        position: 'absolute',
        zIndex: 2,
        top: 40,
        flexDirection: 'row',
      },
      track: {
        backgroundColor: '#ccc',
        overflow: 'hidden',
        height: 2,
      },
      bar: {
        backgroundColor: '#5294d6',
        height: 2,
        position: 'absolute',
        left: 0,
        top: 0,
      },
      button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        marginVertical:4,
        backgroundColor: "#B1D4E0",
        width: deviceWidth-20,
      },
      text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
      },
  });

  export default styles;