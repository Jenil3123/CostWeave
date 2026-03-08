import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  Animated,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Yarn({ navigation }) {

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const resetScale = useRef(new Animated.Value(1)).current;
  const nextScale = useRef(new Animated.Value(1)).current;

  const scrollRef = useRef(null);
  const resultRef = useRef(null);

  const warpRateRef = useRef(null);
  const warpWastageRef = useRef(null);
  const weftCountRef = useRef(null);
  const weftRateRef = useRef(null);
  const weftWastageRef = useRef(null);
  const widthRef = useRef(null);
  const endsRef = useRef(null);
  const ppiRef = useRef(null);

  const [showResult, setShowResult] = useState(false);

  const [warpCount, setWarpCount] = useState("");
  const [warpRate, setWarpRate] = useState("");
  const [warpWastage, setWarpWastage] = useState("");

  const [weftCount, setWeftCount] = useState("");
  const [weftRate, setWeftRate] = useState("");
  const [weftWastage, setWeftWastage] = useState("");

  const [fabricWidth, setFabricWidth] = useState("");
  const [totalEnds, setTotalEnds] = useState("");
  const [ppi, setPpi] = useState("");

  const [results, setResults] = useState({
    warpConsumption: 0,
    weftConsumption: 0,
    warpCost: 0,
    weftCost: 0,
    total: 0
  });

  const handlePressIn = () => {
    Animated.spring(scaleAnim,{
      toValue:0.94,
      friction:6,
      tension:120,
      useNativeDriver:true
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim,{
      toValue:1,
      friction:6,
      tension:120,
      useNativeDriver:true
    }).start();
  };

  const calculateYarn = () => {

    if (
      !warpCount ||
      !warpRate ||
      !warpWastage ||
      !weftCount ||
      !weftRate ||
      !weftWastage ||
      !fabricWidth ||
      !totalEnds ||
      !ppi
    ) {
      alert("Please fill all fields before calculating.");
      return;
    }

    Keyboard.dismiss();

    const warpConsumption =
      Number(totalEnds) /
      (Number(warpCount) * 840);

    const weftConsumption =
      (Number(ppi) * Number(fabricWidth)) /
      (Number(weftCount) * 840);

    const warpCost =
      warpConsumption *
      Number(warpRate) *
      (1 + Number(warpWastage) / 100);

    const weftCost =
      weftConsumption *
      Number(weftRate) *
      (1 + Number(weftWastage) / 100);

    const total = warpCost + weftCost;

    setResults({
      warpConsumption,
      weftConsumption,
      warpCost,
      weftCost,
      total
    });

    setShowResult(true);

    setTimeout(() => {
      resultRef.current?.measureLayout(
        scrollRef.current,
        (x, y) => {
          scrollRef.current.scrollTo({
            y: y - 60,
            animated: true
          });
        }
      );
    },300);
  };

  const resetForm = () => {

    setWarpCount("");
    setWarpRate("");
    setWarpWastage("");

    setWeftCount("");
    setWeftRate("");
    setWeftWastage("");

    setFabricWidth("");
    setTotalEnds("");
    setPpi("");

    setShowResult(false);

    setResults({
      warpConsumption:0,
      weftConsumption:0,
      warpCost:0,
      weftCost:0,
      total:0
    });

    scrollRef.current?.scrollTo({ y:0, animated:true });
  };

  const resetResult = (setter) => (value) => {
    setter(value);
    setShowResult(false);
  };

  return (
<SafeAreaView style={{flex:1}}>
<KeyboardAvoidingView
style={{flex:1}}
behavior={Platform.OS==="ios"?"padding":"height"}
keyboardVerticalOffset={20}
>

<ScrollView
ref={scrollRef}
style={styles.container}
showsVerticalScrollIndicator={false}
keyboardShouldPersistTaps="always"
contentContainerStyle={{paddingBottom:70}}
>

<Text style={styles.title}>Textile Fabric Costing</Text>
<Text style={styles.subtitle}>Traditional 60 Paisa Logic</Text>

<View style={styles.infoCard}>

<View style={{flexDirection:"row",alignItems:"center"}}>

<Image
source={require("../../assets/images/icons/yarn-spool.png")}
style={{width:24,height:24,marginRight:3}}
resizeMode="contain"
/>

<Text style={styles.infoTitle}>Yarn Costing</Text>

</View>

<Text style={styles.infoDesc}>
Enter yarn specifications and fabric parameters
</Text>

</View>

{/* WARP */}

<View style={styles.card}>
<Text style={styles.sectionTitle}>Warp Yarn</Text>

<Text style={styles.label}>Warp Yarn Count</Text>
<View style={styles.inputRow}>
<TextInput
style={styles.inputField}
placeholder="40.00"
keyboardType="numeric"
value={warpCount}
blurOnSubmit={false}
onChangeText={resetResult(setWarpCount)}
returnKeyType="next"
onSubmitEditing={()=>warpRateRef.current?.focus()}
/>
<Text style={styles.unit}>Ne</Text>
</View>

<Text style={styles.label}>Warp Yarn Rate</Text>
<View style={styles.inputRow}>
<TextInput
ref={warpRateRef}
style={styles.inputField}
placeholder="350"
keyboardType="numeric"
value={warpRate}
blurOnSubmit={false}
onChangeText={resetResult(setWarpRate)}
returnKeyType="next"
onSubmitEditing={()=>warpWastageRef.current?.focus()}
/>
<Text style={styles.unit}>₹/kg</Text>
</View>

<Text style={styles.label}>Warp Wastage</Text>
<View style={styles.inputRow}>
<TextInput
ref={warpWastageRef}
style={styles.inputField}
placeholder="2"
keyboardType="numeric"
value={warpWastage}
blurOnSubmit={false}
onChangeText={resetResult(setWarpWastage)}
returnKeyType="next"
onSubmitEditing={()=>weftCountRef.current?.focus()}
/>
<Text style={styles.unit}>%</Text>
</View>
</View>

{/* WEFT */}

<View style={styles.card}>
<Text style={styles.sectionTitle}>Weft Yarn</Text>

<Text style={styles.label}>Weft Yarn Count</Text>
<View style={styles.inputRow}>
<TextInput
ref={weftCountRef}
style={styles.inputField}
placeholder="40.00"
keyboardType="numeric"
value={weftCount}
blurOnSubmit={false}
onChangeText={resetResult(setWeftCount)}
returnKeyType="next"
onSubmitEditing={()=>weftRateRef.current?.focus()}
/>
<Text style={styles.unit}>Ne</Text>
</View>

<Text style={styles.label}>Weft Yarn Rate</Text>
<View style={styles.inputRow}>
<TextInput
ref={weftRateRef}
style={styles.inputField}
placeholder="350"
keyboardType="numeric"
value={weftRate}
blurOnSubmit={false}
onChangeText={resetResult(setWeftRate)}
returnKeyType="next"
onSubmitEditing={()=>weftWastageRef.current?.focus()}
/>
<Text style={styles.unit}>₹/kg</Text>
</View>

<Text style={styles.label}>Weft Wastage</Text>
<View style={styles.inputRow}>
<TextInput
ref={weftWastageRef}
style={styles.inputField}
placeholder="2"
keyboardType="numeric"
value={weftWastage}
blurOnSubmit={false}
onChangeText={resetResult(setWeftWastage)}
returnKeyType="next"
onSubmitEditing={()=>widthRef.current?.focus()}
/>
<Text style={styles.unit}>%</Text>
</View>
</View>

{/* FABRIC */}

<View style={styles.card}>
<Text style={styles.sectionTitle}>Fabric Specifications</Text>

<Text style={styles.label}>Fabric Width</Text>
<View style={styles.inputRow}>
<TextInput
ref={widthRef}
style={styles.inputField}
placeholder="58"
keyboardType="numeric"
value={fabricWidth}
blurOnSubmit={false}
onChangeText={resetResult(setFabricWidth)}
returnKeyType="next"
onSubmitEditing={()=>endsRef.current?.focus()}
/>
<Text style={styles.unit}>inch</Text>
</View>

<Text style={styles.label}>Total Ends</Text>
<View style={styles.inputRow}>
<TextInput
ref={endsRef}
style={styles.inputField}
placeholder="2000"
keyboardType="numeric"
value={totalEnds}
blurOnSubmit={false}
onChangeText={resetResult(setTotalEnds)}
returnKeyType="next"
onSubmitEditing={()=>ppiRef.current?.focus()}
/>
<Text style={styles.unit}>ends</Text>
</View>

<Text style={styles.label}>Picks Per Inch (PPI)</Text>
<View style={styles.inputRow}>
<TextInput
ref={ppiRef}
style={styles.inputField}
placeholder="80"
keyboardType="numeric"
value={ppi}
onChangeText={resetResult(setPpi)}
returnKeyType="done"
onSubmitEditing={calculateYarn}
/>
<Text style={styles.unit}>PPI</Text>
</View>
</View>

{/* CALCULATE BUTTON */}

<Animated.View style={{transform:[{scale:scaleAnim}]}}>
<TouchableOpacity
activeOpacity={0.85}
style={styles.button}
onPress={calculateYarn}
onPressIn={handlePressIn}
onPressOut={handlePressOut}
>
<View style={styles.buttonContent}>
<Ionicons name="calculator-outline" size={20} color="#fff"/>
<Text style={styles.buttonText}>Calculate Yarn Costing</Text>
</View>
</TouchableOpacity>
</Animated.View>

{/* RESET BUTTON */}

<Animated.View style={{transform:[{scale:resetScale}]}}>
<TouchableOpacity
style={styles.resetButton}
activeOpacity={0.85}
onPress={resetForm}
onPressIn={()=>{
Animated.spring(resetScale,{toValue:0.94,friction:6,tension:120,useNativeDriver:true}).start();
}}
onPressOut={()=>{
Animated.spring(resetScale,{toValue:1,friction:6,tension:120,useNativeDriver:true}).start();
}}
>
<View style={styles.buttonContent}>
<Ionicons name="refresh-outline" size={20} color="#fff"/>
<Text style={styles.resetText}>Reset Yarn Values</Text>
</View>
</TouchableOpacity>
</Animated.View>

</ScrollView>
</KeyboardAvoidingView>
</SafeAreaView>
);
}

const styles = StyleSheet.create({

container:{
flex:1,
padding:20,
backgroundColor:"#f3f4f6"
},

title:{
fontSize:26,
fontWeight:"700"
},

subtitle:{
color:"#6b7280",
marginBottom:20
},

infoCard:{
backgroundColor:"#dbeafe",
padding:16,
borderRadius:14,
marginBottom:20
},

infoTitle:{
fontSize:16,
fontWeight:"700"
},

infoDesc:{
color:"#1f2937",
marginTop:2
},

card:{
backgroundColor:"#fff",
padding:18,
borderRadius:16,
marginBottom:20,
elevation:4
},

sectionTitle:{
fontSize:18,
fontWeight:"700",
marginBottom:10
},

label:{
marginTop:12,
marginBottom:5,
fontWeight:"500",
color:"#374151"
},

inputRow:{
flexDirection:"row",
alignItems:"center",
backgroundColor:"#f1f5f9",
borderRadius:12,
paddingHorizontal:12,
marginBottom:10
},

inputField:{
flex:1,
paddingVertical:14,
fontSize:15
},

unit:{
fontSize:14,
fontWeight:"600",
color:"#6b7280"
},

button:{
backgroundColor:"#2563eb",
padding:18,
borderRadius:16,
alignItems:"center",
marginTop:10,
marginBottom:15
},

buttonText:{
color:"#fff",
fontSize:16,
fontWeight:"700",
marginLeft:8
},

resetButton:{
backgroundColor:"#ef4444",
padding:16,
borderRadius:14,
alignItems:"center",
marginBottom:25,
marginTop:5
},

resetText:{
color:"#fff",
fontWeight:"700",
fontSize:15,
marginLeft:8
},

buttonContent:{
flexDirection:"row",
alignItems:"center",
justifyContent:"center"
}

});