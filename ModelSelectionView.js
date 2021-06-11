import React, { useState, useEffect }  from 'react';
import { StyleSheet, View,Image, TouchableOpacity, Text,Dimensions,  Pressable } from 'react-native';
import { Button, Input } from 'react-native-elements';
import styles from './styles.js';
import assets from './images.js';

export default function ModelSelectionView(props) {
    const back = props.back;
    const models = props.models;
    const setPlantModel = props.setPlantModel;
    const setModelName = props.setModelName;
    const modelViews=[]
    Object.keys(models).forEach(key => {
        const tmp = ()=>{setPlantModel(models[key]);setModelName(key);back()}
        const modelButton = (
            <Pressable key={key} style={styles.button} onPress={tmp}>
            <Text style={styles.text}>{key}</Text>
            </Pressable>
        )
        modelViews.push(modelButton);
    });
    
    return(
        <View style={styles.container}>
        {modelViews}
        <Pressable style={styles.button} onPress={()=>{}}>
            <Text style={styles.text}>Load New Model</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={back}>
            <Text style={styles.text}>Back</Text>
        </Pressable>
    </View>
    )
}