import { StyleSheet, Text, View } from "react-native";

export default function Saved() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Final Costing</Text>
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