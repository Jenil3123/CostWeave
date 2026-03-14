import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCost } from "../../context/CostContext";

/* -------- Helper Function -------- */

const formatCurrency = (num: number) => {
  return new Intl.NumberFormat("en-IN").format(num);
};

export default function Final() {

  const router = useRouter();
  useFocusEffect(
    useCallback(() => {
      setSaveState("idle");
    }, [])
  );

  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");

  /* -------- Modal State -------- */

  const [modalVisible, setModalVisible] = useState(false);
  const [fabricName, setFabricName] = useState("");
  const [notes, setNotes] = useState("");
  const [errorText, setErrorText] = useState("");

  /* -------- Get costs from global context -------- */

  const {
    yarnCost,
    manufacturingCost,
    totalMeters,
    warpCount,
    weftCount,
    fabricWidth,
    totalEnds,
    ppi
  } = useCost();

  /* -------- Final Calculation -------- */

  const finalPrice = yarnCost + manufacturingCost;

  /* -------- Open Save Modal -------- */

  const handleSaveCalculation = () => {

    if (yarnCost === 0 || manufacturingCost === 0) {
      Alert.alert("Missing Data", "Please calculate yarn and production cost first.");
      return;
    }

    setModalVisible(true);
  };

  /* -------- Confirm Save -------- */

  const confirmSave = async () => {

    if (!fabricName.trim()) {
      setErrorText("Please enter a fabric name");
      return;
    }

    try {

      setSaveState("saving");

      const newCalculation = {
        id: Date.now(),

        fabricName,
        notes,

        /* Yarn Tab Data */
        warpCount,
        weftCount,
        fabricWidth,
        totalEnds,
        ppi,

        /* Costing */
        yarnCost,
        manufacturingCost,
        totalCost: yarnCost + manufacturingCost,
        finalPrice,

        /* Production */
        totalMeters,

        date: new Date().toLocaleString()
      };

      const existingData = await AsyncStorage.getItem("fabricHistory");

      let history: any[] = [];

      if (existingData) {
        try {
          history = JSON.parse(existingData);
        } catch {
          history = [];
        }
      }
      /* Add new calculation at top */
      const updatedHistory = [newCalculation, ...history];

      /* Save history */
      await AsyncStorage.setItem(
        "fabricHistory",
        JSON.stringify(updatedHistory)
      );

      setModalVisible(false);
      setFabricName("");
      setNotes("");
      setErrorText("");
      setSaveState("saved");

      // Immediately go to History tab
      router.push({
        pathname: "/(tabs)/History",
        params: { highlightId: newCalculation.id }
      });

    } catch (error) {

      Alert.alert("Error", "Failed to save calculation");
      setSaveState("idle");

    }

  };

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >

        {/* -------- Header -------- */}

        <View style={styles.headerCard}>
          <Ionicons name="calculator-outline" size={22} color="#4338ca" />
          <View>
            <Text style={styles.headerTitle}>Final Costing</Text>
            <Text style={styles.headerSub}>
              Cost breakdown and final price
            </Text>
          </View>
        </View>

        {/* -------- Cost Summary -------- */}

        <View style={styles.card}>

          <Text style={styles.sectionTitle}>
            Cost Summary per Meter
          </Text>

          <View style={styles.row}>
            <Text style={styles.label}>Yarn Cost</Text>
            <Text style={styles.value}>
              ₹ {formatCurrency(yarnCost)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Manufacturing Cost</Text>
            <Text style={styles.value}>
              ₹ {formatCurrency(manufacturingCost)}
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

        {/* -------- Final Price Card -------- */}

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

        {/* -------- Bottom Buttons -------- */}

        <View style={styles.bottomButtons}>

          <Pressable
            style={styles.backBtn}
            onPress={() => router.push("/(tabs)/Production")}
          >
            <Ionicons name="arrow-back" size={18} />
            <Text style={styles.backText}>Back</Text>
          </Pressable>

          <Pressable
            style={styles.saveBtn}
            onPress={handleSaveCalculation}
            disabled={saveState === "saving"}
          >

            {saveState === "saving" && (
              <ActivityIndicator color="white" />
            )}

            {saveState === "idle" && (
              <>
                <Ionicons name="save-outline" size={18} color="white" />
                <Text style={styles.saveText}>Save Calculation</Text>
              </>
            )}

            {saveState === "saved" && (
              <>
                <Ionicons name="checkmark" size={18} color="white" />
                <Text style={styles.saveText}>Saved</Text>
              </>
            )}

          </Pressable>

        </View>

      </ScrollView>

      {/* -------- Save Modal -------- */}

      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
      >

        <View style={styles.modalOverlay}>

          <View style={styles.modalCard}>

            <Text style={styles.modalTitle}>
              Save Calculation
            </Text>

            <Text style={styles.modalSubtitle}>
              Enter a name to identify this costing later
            </Text>

            <Text style={styles.modalLabel}>
              Fabric Name *
            </Text>

            <TextInput
              placeholder="e.g. Cotton 40s Poplin"
              style={[
                styles.modalInput,
                errorText ? styles.inputError : null
              ]}
              value={fabricName}
              onChangeText={(text) => {
                setFabricName(text);
                if (errorText) setErrorText("");
              }}
            />

            {errorText ? (
              <Text style={styles.errorText}>{errorText}</Text>
            ) : null}

            <Text style={styles.modalLabel}>
              Notes (Optional)
            </Text>

            <TextInput
              placeholder="Add notes..."
              style={styles.modalInput}
              value={notes}
              onChangeText={setNotes}
            />

            <View style={styles.modalButtons}>

              <Pressable
                style={styles.cancelBtn}
                onPress={() => {
                  setModalVisible(false);
                  setSaveState("idle");
                }}
              >
                <Text style={styles.cancelText}>
                  Cancel
                </Text>
              </Pressable>

              <Pressable
                style={styles.confirmBtn}
                onPress={confirmSave}
              >
                <Text style={styles.confirmText}>
                  Save Calculation
                </Text>
              </Pressable>

            </View>

          </View>

        </View>

      </Modal>

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
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20
  },

  modalCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700"
  },

  modalSubtitle: {
    color: "#6b7280",
    marginBottom: 16,
    marginTop: 4
  },

  modalLabel: {
    fontWeight: "600",
    marginTop: 10
  },

  modalInput: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 10,
    marginTop: 6
  },

  inputError: {
    borderColor: "#ef4444"
  },

  errorText: {
    color: "#ef4444",
    fontSize: 13,
    marginTop: 4
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20
  },

  cancelBtn: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10
  },

  cancelText: {
    fontWeight: "600",
    color: "#374151"
  },

  confirmBtn: {
    backgroundColor: "#059669",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10
  },

  confirmText: {
    color: "white",
    fontWeight: "600"
  }

});