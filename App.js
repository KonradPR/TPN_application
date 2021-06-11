import React, { useState, useEffect }  from 'react';
import { StyleSheet, View,Image, TouchableOpacity, Text,Pressable } from 'react-native';
import { Button, Input } from 'react-native-elements';
import * as tf from '@tensorflow/tfjs';
import { fetch, bundleResourceIO } from '@tensorflow/tfjs-react-native';
import * as jpeg from 'jpeg-js';
import {cameraWithTensors} from '@tensorflow/tfjs-react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import {decode as atob, encode as btoa} from 'base-64'
import { Platform, ActivityIndicator } from 'react-native';
import PredictionView from './PredictionView.js';
import LoadingView from './LoadingView.js';
import MainView from './MainView.js';
import styles from './styles.js';
import ModelSelectionView from './ModelSelectionView.js';
import assets from './images.js';
const TensorCamera = cameraWithTensors(Camera);

export default function App() {
    const [isEnabled,setIsEnabled] = useState(true)
    const [predictionSet,setpredictionSet] = useState(false)
    const [predicition,setprediction] = useState("")
    const [useCam,setUseCam] = useState(false)
    const [plantModel,setPlantModel]=useState("")
    const [models, setModels]=useState("");
    const [numModels, setNumModels]=useState(0);
    const [modelName, setModelName]=useState("");
    const [hasPermission, setHasPermission] = useState(null);
    const [imageFromCamera, setImageFromCamera] = useState(null);
    const [loading,setLoading] = useState(true)
    const [selecting,setSelecting] = useState(false)
    const [isStarting,setStarting] = useState(true)
    const textureDims = Platform.OS === "ios"? { width: 1080, height: 1920 } : { width: 1600, height: 1200 };
    const tensorDims = { width: 224, height: 224 }; 
    useEffect(() => {
      async function loadModel(){
        console.log("[+] Application started")
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        console.log(`permissions status: ${status}`);
        setHasPermission(status === 'granted');
        //Wait for tensorflow module to be ready
        const tfReady = await tf.ready();
        console.log("[+] Loading model")
        //const modelJson = await require("./assets/model/model.json");
        //const modelWeight = await require("./assets/model/group1-shard.bin");
        //const model = await tf.loadGraphModel(bundleResourceIO(modelJson,modelWeight));
        //setPlantModel(model)
        await loadModels();
        console.log("[+] Model Loaded")
        setLoading(false);
        setStarting(false);
      }
      loadModel()
    }, []); 

    function findIndicesOfMax(inp, count) {
      var outp = [];
      for (var i = 0; i < inp.length; i++) {
          outp.push(i); // add index to output array
          if (outp.length > count) {
              outp.sort(function(a, b) { return inp[b] - inp[a]; }); // descending sort the output array
              outp.pop(); // remove the last index (index of smallest element in output array)
          }
      }
      return outp;
  }

  const loadModels = async()=>{
    var models={};
    for(var i=0;i<assets["models"]["number"];i++){
      var tmp = await tf.loadGraphModel(bundleResourceIO(assets["models"][i]["modelJson"],assets["models"][i]["modelWeight"]));
      models[assets["models"][i]["name"]] = tmp;
    }
    setPlantModel(models[assets["models"][0]["name"]]);
    setModelName(assets["models"][0]["name"]);
    setModels(models);
    setNumModels(assets["models"]["number"]);
  }

    const getFromCamera = async() => {
      try{
        setLoading(true);
        let result = await plantModel.predict(tf.cast(imageFromCamera.expandDims(0),'float32')).data();
        console.log(result);
        let indices = findIndicesOfMax(result,5)
        console.log("[+] Prediction Completed")
        let predictions = {}
        for(let i=0;i<indices.length;i++){
          predictions[i] = {index:indices[i],probablity:result[indices[i]]};
        }
        setprediction(predictions);
        setLoading(false);
        setpredictionSet(true);
      }catch(error){
        console.log(error)
      }
      
    }
    
    const switchView = () =>{
      setUseCam(!useCam)
    }

    function imageToTensor(rawImageData){
      //Function to convert jpeg image to tensors
      const TO_UINT8ARRAY = true;
      const { width, height, data } = jpeg.decode(rawImageData, TO_UINT8ARRAY);
      const buffer = new Uint8Array(width * height * 3);
      let offset = 0; // offset into original data
      for (let i = 0; i < buffer.length; i += 3) {
        buffer[i] = data[offset];
        buffer[i + 1] = data[offset + 1];
        buffer[i + 2] = data[offset + 2];
        offset += 4;
      }
      return tf.tensor3d(buffer, [height, width, 3]);
    }

    function base64ToArrayBuffer(base64) {
      var binary_string = atob(base64);
      var len = binary_string.length;
      var bytes = new Uint8Array(len);
      for (var i = 0; i < len; i++) {
          bytes[i] = binary_string.charCodeAt(i);
      }
      return bytes.buffer;
  }
    const getFromGallery = async() => {
      try{
        console.log("taking picture");
        setLoading(true);
        const responsey = await ImagePicker.launchImageLibraryAsync({base64: true, quality: 1,});
        console.log("after");
        const rawImageData =  base64ToArrayBuffer(responsey.base64)
      
        const imageTensor = imageToTensor(rawImageData).resizeBilinear([224,224])
        
        let result = await plantModel.predict(imageTensor.expandDims(0)).data()
        console.log(result);
        let indices = findIndicesOfMax(result,5)
        console.log("[+] Prediction Completed")
        //setprediction(labels[maximum])
        let predictions = {}
        for(let i=0;i<indices.length;i++){
          predictions[i] = {index:indices[i],probablity:result[indices[i]]}
        }
        setprediction(predictions);
        setLoading(false);
        setpredictionSet(true);
      }catch(error){
        console.log(error)
      }
      
    }
    
    function handleCameraStream(images, updatePreview, gl) {
      const loop = async () => {
        const nextImageTensor = images.next().value
        setImageFromCamera(nextImageTensor);
        requestAnimationFrame(loop);
      }
      loop();
    }

    if(loading){
      return <LoadingView isStarting={isStarting}/>
    }else if (selecting){
      const back = () =>setSelecting(false);
      const switchModel = (model) =>setPlantModel(model);
      const switchModelName = (modelName)=> setModelName(modelName);
      return <ModelSelectionView back={back} models={models} setPlantModel={switchModel} setModelName={switchModelName}/>
    }
    else if(predictionSet){
      const back = () =>setpredictionSet(false);
    return <PredictionView prediction={predicition} back={back}/>
  }else if(useCam){
    return <View style={styles.container}>
       <TensorCamera
           // Standard Camera props
           style={styles.camera}
           type={Camera.Constants.Type.front}
           // Tensor related props
           cameraTextureHeight={textureDims.height}
           cameraTextureWidth={textureDims.width}
           resizeHeight={224}
           resizeWidth={224}
           resizeDepth={3}
           onReady={handleCameraStream}
           autorender={true}
          />
          <Pressable style={styles.button} onPress={getFromCamera}>
             <Text style={styles.text}>Take photo</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={switchView}>
             <Text style={styles.text}>Back</Text>
        </Pressable>
    </View>
  }else{
    const getGallery = () => getFromGallery();
    const changeToCamera = () => switchView();
    const selecting = () => {setSelecting(true);};
  return <MainView modelName={modelName} getFromGallery={getGallery} changeToCamera={changeToCamera} selecting={selecting}/>
  }
}



