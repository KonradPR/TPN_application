import React, { useState, useEffect }  from 'react';
import { Animated, View, StyleSheet, Image, Dimensions, ScrollView, Text,Pressable } from 'react-native';
import { Button, Input } from 'react-native-elements';
import assets from './images.js';
import styles from './styles.js'

const deviceWidth = Dimensions.get('window').width
const FIXED_BAR_WIDTH = 280
const BAR_SPACE = 10

export default function PredictionView(props) {
  const back = props.back;
  const tmp = props.prediction;
  let numItems = 5;
  const predictions = [];
  for (const key in tmp) {
    predictions.push(tmp[key])
        }
        console.log("ASSETS")
        console.log(assets);
        console.log("PREDICTIONS")
        console.log(predictions);
  let itemWidth = (FIXED_BAR_WIDTH / numItems) - ((numItems - 1) * BAR_SPACE)
  let animVal = new Animated.Value(0) 
  let imageArray = []
  let barArray = []
  predictions.forEach((prediction, i) => {
    const thisImage = (
      <View key={`image${i}`} style={styles.container} >
        <Image
          source={assets[prediction["index"]]["picture"]}
          style={{ width: deviceWidth , height:340}}
       />
       <Text style={{ color: 'white' }}>{assets[prediction["index"]]["name"]}</Text>
       <Text style={{ color: 'white' }}>{"Probablity: "+prediction["probablity"].toFixed(2)}</Text>
      </View>
    )
    imageArray.push(thisImage)

    const scrollBarVal = animVal.interpolate({
      inputRange: [deviceWidth * (i - 1), deviceWidth * (i + 1)],
      outputRange: [-itemWidth, itemWidth],
      extrapolate: 'clamp',
    })

    const thisBar = (
      <View
        key={`bar${i}`}
        style={[
          styles.track,
          {
            width: itemWidth,
            marginLeft: i === 0 ? 0 : BAR_SPACE,
          },
        ]}
      >
        <Animated.View

          style={[
            styles.bar,
            {
              width: itemWidth,
              transform: [
                { translateX: scrollBarVal },
              ],
            },
          ]}
        />
      </View>
    )
    barArray.push(thisBar)
  })

 
    return (
      <View
      style={styles.container}
      flex={1}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={10}
        pagingEnabled
        onScroll={
          Animated.event(
            [{ nativeEvent: { contentOffset: { x:animVal } } }],
            {useNativeDriver:false}
          )
        }
      >

        {imageArray}

      </ScrollView>
      <View
        style={styles.barContainer}
      >
        {barArray}
      </View>
      <Pressable style={styles.button} onPress={back}>
             <Text style={styles.text}>Back</Text>
        </Pressable>
    </View> 
      )
}


  