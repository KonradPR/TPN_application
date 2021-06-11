import React, { useState, useEffect }  from 'react';
import { StyleSheet, View,Image, TouchableOpacity, Text } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { Platform, ActivityIndicator } from 'react-native';
import styles from './styles.js';

export default function PredictionView(props) {
    if(props.isStarting){
    return(
    <View style={styles.container}>
        <Text style={{ color: 'white' }}>Loading...</Text>
         <ActivityIndicator size="large" color="#B1D4E0"/>
    </View>
    )}else{
        return(
            <View style={styles.container}>
                <Text style={{ color: 'white' }}>Predicting...</Text>
                 <ActivityIndicator size="large" color="#B1D4E0"/>
            </View> 
    )}
}
