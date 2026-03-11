import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/* -------- Helper -------- */

const formatCurrency = (num: number) => {
  return new Intl.NumberFormat("en-IN").format(num);
};

export default function Final() {

  const router = useRouter();

  /* -------- Receive values from previous tabs -------- */

  const { yarnCost, manufacturingCost } = useLocalSearchParams();

  const yarn = Number(yarnCost) || 0;
  const manufacturing = Number(manufacturingCost) || 0;

  /* -------- Final Calculation -------- */

  const finalPrice = yarn + manufacturing;

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >

        {/* Header */}

        <View style={styles.headerCard}>
          <Ionicons name="calculator-outline" size={22} color="#4338ca" />
          <View>
            <Text style={styles.headerTitle}>Final Costing</Text>
            <Text style={styles.headerSub}>
              Cost breakdown and final price
            </Text>
          </View>
        </View>

        {/* Cost Summary */}

        <View style={styles.card}>

          <Text style={styles.sectionTitle}>
            Cost Summary per Meter
          </Text>

          <View style={styles.row}>
            <Text style={styles.label}>Yarn Cost</Text>
            <Text style={styles.value}>
              ₹ {formatCurrency(yarn)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Manufacturing Cost</Text>
            <Text style={styles.value}>
              ₹ {formatCurrency(manufacturing)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.totalLabel}>Total Fabric Cost</Text>
            <Text style={styles.totalValue}>
              ₹ {formatCurrency(finalPrice)}
            </Text>
          </View>

        </View>

        {/* Final Price */}

        <View style={styles.finalCard}>

          <Text style={styles.finalTitle}>
            Final Price
          </Text>

          <View style={styles.finalPriceBox}>
            <Text style={styles.finalPriceText}>
              Final Price per Meter
            </Text>
            <Text style={styles.finalPriceValue}>
              ₹ {formatCurrency(finalPrice)}
            </Text>
          </View>

        </View>

        {/* Buttons */}

        <View style={styles.bottomButtons}>

          <Pressable
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={18} />
            <Text style={styles.backText}>Back</Text>
          </Pressable>

          <Pressable style={styles.saveBtn}>
            <Ionicons name="save-outline" size={18} color="white" />
            <Text style={styles.saveText}>Save Calculation</Text>
          </Pressable>

        </View>

      </ScrollView>

    </SafeAreaView>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({

  container: {
    backgroundColor: "#f4f4f5",
    padding: 16
  },

  headerCard: {
    backgroundColor: "#e0e7ff",
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    gap: 10,
    marginBottom: 16
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4338ca"
  },

  headerSub: {
    color: "#4f46e5"
  },

  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12
  },

  label: {
    fontSize: 15
  },

  value: {
    fontWeight: "600"
  },

  totalLabel: {
    fontWeight: "700",
    fontSize: 16
  },

  totalValue: {
    fontWeight: "700",
    fontSize: 16
  },

  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 10
  },

  finalCard: {
    backgroundColor: "#10b981",
    borderRadius: 18,
    padding: 20,
    marginBottom: 20
  },

  finalTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14
  },

  finalPriceBox: {
    backgroundColor: "#059669",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between"
  },

  finalPriceText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16
  },

  finalPriceValue: {
    color: "white",
    fontWeight: "800",
    fontSize: 22
  },

  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-between"
  },

  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e5e7eb",
    padding: 14,
    borderRadius: 12,
    flex: 1,
    justifyContent: "center",
    marginRight: 8
  },

  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#059669",
    padding: 14,
    borderRadius: 12,
    flex: 1,
    justifyContent: "center",
    marginLeft: 8
  },

  backText: {
    fontWeight: "600",
    marginLeft: 6
  },

  saveText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 6
  }

});