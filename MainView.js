import React, { useState, useEffect }  from 'react';
import { StyleSheet, View,Image, TouchableOpacity, Text,Dimensions,  Pressable } from 'react-native';
import { Button, Input } from 'react-native-elements';
import styles from './styles.js';
import assets from './images.js';

export default function PredictionView(props) {
    const getFromGallery = props.getFromGallery;
    const changeToCamera = props.changeToCamera;
    const selecting = props.selecting;
    const modelName = props.modelName;
    const deviceWidth = Dimensions.get('window').width
    return(
        <View style={styles.container}>
            <Image
          source={assets["main"]}
          style={{ width: deviceWidth , height:340}}
       />
        <Pressable style={styles.button} onPress={getFromGallery}>
            <Text style={styles.text}>Gallery</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={changeToCamera}>
             <Text style={styles.text}>Camera</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={selecting}>
             <Text style={styles.text}>Switch model</Text>
        </Pressable>
        <Text style={styles.text}>Currently used model: {modelName}</Text>
    </View>
    )
}