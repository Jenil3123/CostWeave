import { StyleSheet, Text, View } from "react-native";

export default function FabricWeightCalculator() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fabric Weight Calculator</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
});