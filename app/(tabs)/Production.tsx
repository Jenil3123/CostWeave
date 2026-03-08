import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";

import FabricCost from "../calculators/fabricCost";
import FabricWeight from "../calculators/fabricWeight";
import Yarn from "../calculators/yarn";

export default function Calculator() {

  const [type, setType] = useState("yarn");

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Production & Efficiency</Text>

      <View style={styles.menu}>
        <Button mode="contained" onPress={() => setType("yarn")}>
          Yarn
        </Button>

        <Button mode="contained" onPress={() => setType("cost")}>
          Fabric Cost
        </Button>

        <Button mode="contained" onPress={() => setType("weight")}>
          Weight
        </Button>
      </View>

      {type === "yarn" && <Yarn />}
      {type === "cost" && <FabricCost />}
      {type === "weight" && <FabricWeight />}

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },

  menu: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

});