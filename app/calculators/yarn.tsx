import { StyleSheet, Text, View } from "react-native";

export default function YarnCalculator() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Yarn Calculator</Text>
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