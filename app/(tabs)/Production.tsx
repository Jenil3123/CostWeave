import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCost } from "../../context/CostContext";

/* ---------- Helpers ---------- */

const formatCurrency = (value: string) => {
  const cleaned = value.replace(/[^0-9]/g, "");
  if (!cleaned && cleaned !== "0") return "";
  return new Intl.NumberFormat("en-IN").format(Number(cleaned));
};

const formatNumber = (value: string) => {
  const cleaned = value.replace(/[^0-9]/g, "");
  if (!cleaned && cleaned !== "0") return "";
  return new Intl.NumberFormat("en-IN").format(Number(cleaned));
};

const cleanNumber = (value: string) => {
  return Number(value.replace(/,/g, "")) || 0;
};

export default function Production() {

  const [labour, setLabour] = useState("");
  const [electricity, setElectricity] = useState("");
  const [maintenance, setMaintenance] = useState("");
  const [monthlyProduction, setMonthlyProduction] = useState("");
  const [calculated, setCalculated] = useState(false);

  const { setManufacturingCost, setTotalMeters } = useCost();

  const electricityRef = useRef<TextInput>(null);
  const maintenanceRef = useRef<TextInput>(null);
  const productionRef = useRef<TextInput>(null);

  const scrollViewRef = useRef<KeyboardAwareScrollView>(null);

  const [extraExpenses, setExtraExpenses] = useState<
    { name: string; amount: string }[]
  >([{ name: "", amount: "" }]);

  const [errors, setErrors] = useState({
    labour: false,
    electricity: false,
    maintenance: false,
    production: false,
    expenses: false
  });

  /* ---------- Expense Functions ---------- */

  const addExpense = () => {
    setExtraExpenses([...extraExpenses, { name: "", amount: "" }]);
  };

  const removeExpense = (index: number) => {
    const updated = extraExpenses.filter((_, i) => i !== index);
    setExtraExpenses(updated.length ? updated : [{ name: "", amount: "" }]);
  };

  const updateExpense = (
    index: number,
    field: "name" | "amount",
    value: string
  ) => {
    const updated = [...extraExpenses];
    updated[index][field] = value;
    setExtraExpenses(updated);
  };

  /* ---------- Calculations ---------- */

  const baseExpenses =
    cleanNumber(labour) +
    cleanNumber(electricity) +
    cleanNumber(maintenance);

  const extraTotal = extraExpenses.reduce(
    (sum, item) => sum + cleanNumber(item.amount),
    0
  );

  const totalExpenses = baseExpenses + extraTotal;

  const production = cleanNumber(monthlyProduction);

  const costPerMeter =
    production > 0 ? (totalExpenses / production).toFixed(2) : "0";

  /* ---------- Validation ---------- */

  const validateFields = () => {

    let valid = true;

    const newErrors = {
      labour: false,
      electricity: false,
      maintenance: false,
      production: false,
      expenses: false
    };

    if (labour === "") {
      newErrors.labour = true;
      valid = false;
    }

    if (electricity === "") {
      newErrors.electricity = true;
      valid = false;
    }

    if (maintenance === "") {
      newErrors.maintenance = true;
      valid = false;
    }

    if (monthlyProduction === "") {
      newErrors.production = true;
      valid = false;
    }

    for (let item of extraExpenses) {
      if (item.name.trim() === "" || item.amount === "") {
        newErrors.expenses = true;
        valid = false;
        break;
      }
    }

    setErrors(newErrors);

    return valid;
  };

  /* ---------- Calculate ---------- */

  const handleCalculate = () => {

    if (!validateFields()) {
      scrollViewRef.current?.scrollToPosition(0, 200, true);
      return;
    }

    Keyboard.dismiss();
    setCalculated(true);

    setManufacturingCost(Number(costPerMeter));
    setTotalMeters(production); setTimeout(() => {
      scrollViewRef.current?.scrollToEnd(true);
    }, 200);
  };

  /* ---------- UI ---------- */

  return (
    <SafeAreaView style={styles.container}>

      <KeyboardAwareScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={100}
        contentContainerStyle={{ paddingBottom: 20 }}
      >

        {/* Header */}
        <View style={styles.headerCard}>
          <Ionicons name="stats-chart-outline" size={22} color="#7c2d12" />
          <View>
            <Text style={styles.headerTitle}>Production & Efficiency</Text>
            <Text style={styles.headerSub}>
              Monthly expenses and production details
            </Text>
          </View>
        </View>

        {/* Monthly Expenses */}
        <View style={styles.card}>

          <Text style={styles.sectionTitle}>Monthly Expenses</Text>

          {/* Labour */}
          <Text style={styles.label}>Labour / Salary per Month</Text>
          <View style={[styles.inputRow, errors.labour && styles.inputError]}>
            <TextInput
              placeholder="Enter labour cost"
              keyboardType="numeric"
              style={styles.input}
              value={labour}
              returnKeyType="next"
              onSubmitEditing={() => electricityRef.current?.focus()}
              blurOnSubmit={false}
              onChangeText={(text) => setLabour(formatCurrency(text))}
            />
            <Text style={styles.unit}>₹</Text>
          </View>
          {errors.labour && <Text style={styles.errorText}>Enter labour cost</Text>}

          {/* Electricity */}
          <Text style={styles.label}>Electricity Cost per Month</Text>
          <View style={[styles.inputRow, errors.electricity && styles.inputError]}>
            <TextInput
              ref={electricityRef}
              placeholder="Enter electricity cost"
              keyboardType="numeric"
              style={styles.input}
              value={electricity}
              returnKeyType="next"
              onSubmitEditing={() => maintenanceRef.current?.focus()}
              blurOnSubmit={false}
              onChangeText={(text) => setElectricity(formatCurrency(text))}
            />
            <Text style={styles.unit}>₹</Text>
          </View>
          {errors.electricity && <Text style={styles.errorText}>Enter electricity cost</Text>}

          {/* Maintenance */}
          <Text style={styles.label}>Maintenance Cost per Month</Text>
          <View style={[styles.inputRow, errors.maintenance && styles.inputError]}>
            <TextInput
              ref={maintenanceRef}
              placeholder="Enter maintenance cost"
              keyboardType="numeric"
              style={styles.input}
              value={maintenance}
              returnKeyType="next"
              onSubmitEditing={() => productionRef.current?.focus()}
              blurOnSubmit={false}
              onChangeText={(text) => setMaintenance(formatCurrency(text))}
            />
            <Text style={styles.unit}>₹</Text>
          </View>
          {errors.maintenance && <Text style={styles.errorText}>Enter maintenance cost</Text>}

          {/* Other Expenses */}
          <Text style={styles.label}>Other Expenses</Text>

          {extraExpenses.map((expense, index) => (
            <View key={index} style={styles.expenseRow}>

              <TextInput
                placeholder="Expense name"
                style={[styles.expenseName, errors.expenses && styles.inputError]}
                value={expense.name}
                onChangeText={(text) =>
                  updateExpense(index, "name", text)
                }
              />

              <View style={[styles.expenseAmountBox, errors.expenses && styles.inputError]}>
                <TextInput
                  placeholder="Amount"
                  keyboardType="numeric"
                  style={styles.expenseAmount}
                  value={expense.amount}
                  onChangeText={(text) =>
                    updateExpense(index, "amount", formatCurrency(text))
                  }
                />
                <Text style={styles.unit}>₹</Text>
              </View>

              <Pressable
                onPress={() => removeExpense(index)}
                style={styles.deleteBtn}
              >
                <Ionicons name="trash-outline" size={18} color="white" />
              </Pressable>

            </View>
          ))}

          {errors.expenses && (
            <Text style={styles.errorText}>
              Fill all expense name and amount fields
            </Text>
          )}

          <Pressable style={styles.addBtn} onPress={addExpense}>
            <Ionicons name="add" size={18} color="white" />
            <Text style={styles.addText}>Add Expense</Text>
          </Pressable>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Monthly Expenses</Text>
            <Text style={styles.totalValue}>
              ₹ {new Intl.NumberFormat("en-IN").format(totalExpenses)}
            </Text>
          </View>

        </View>

        {/* Production */}
        <View style={styles.card}>

          <Text style={styles.sectionTitle}>Production Details</Text>

          <Text style={styles.label}>
            Total Fabric Production per Month
          </Text>

          <View style={[styles.inputRow, errors.production && styles.inputError]}>
            <TextInput
              ref={productionRef}
              placeholder="Enter monthly production"
              keyboardType="numeric"
              style={styles.input}
              value={monthlyProduction}
              returnKeyType="done"
              onChangeText={(text) =>
                setMonthlyProduction(formatNumber(text))
              }
            />
            <Text style={styles.unit}>meters</Text>
          </View>

          {errors.production && (
            <Text style={styles.errorText}>
              Enter monthly production
            </Text>
          )}

        </View>

        {/* Calculate Button */}
        <Pressable
          style={({ pressed }) => [
            styles.calculateBtn,
            pressed && styles.buttonPressed
          ]}
          onPress={handleCalculate}
        >
          <Ionicons name="calculator-outline" size={18} color="white" />
          <Text style={styles.calculateText}>
            Calculate Production Costing
          </Text>
        </Pressable>

        {/* Results */}
        {calculated && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>Production Costs</Text>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Monthly Production</Text>
              <Text style={styles.resultValue}>
                {new Intl.NumberFormat("en-IN").format(production)} meters
              </Text>
            </View>

            <View style={styles.divider} />

            <Text style={styles.costText}>
              Manufacturing Cost per Meter
            </Text>
            <Text style={styles.costValue}>₹ {costPerMeter} /m</Text>

          </View>
        )}

        {/* Bottom Navigation */}
        {calculated && (
          <View style={styles.bottomButtons}>

            <Pressable
              style={({ pressed }) => [
                styles.backBtn,
                pressed && styles.buttonPressed
              ]}
              onPress={() => router.push("/(tabs)/Yarn")}
            >
              <Ionicons name="arrow-back" size={18} color="#020617" />
              <Text style={styles.backText}>Back</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.nextBtn,
                pressed && styles.buttonPressed
              ]}
              onPress={() => router.push("/(tabs)/Final")}
            >
              <Text style={styles.nextText}>Final Costing</Text>
              <Ionicons name="arrow-forward" size={18} color="white" />
            </Pressable>

          </View>
        )}

      </KeyboardAwareScrollView>

    </SafeAreaView>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f4f5", padding: 16 },

  headerCard: { backgroundColor: "#f3e8d5", borderRadius: 16, padding: 16, flexDirection: "row", gap: 10, marginBottom: 16 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#7c2d12" },
  headerSub: { color: "#c2410c" },

  card: { backgroundColor: "white", borderRadius: 16, padding: 18, marginBottom: 16 },

  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10 },

  label: { marginTop: 10, marginBottom: 6, fontWeight: "500" },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "transparent"
  },

  inputError: { borderColor: "#ef4444" },

  input: { flex: 1, paddingVertical: 12 },

  unit: { color: "#64748b", fontWeight: "600" },

  expenseRow: { flexDirection: "row", gap: 8, marginBottom: 8 },

  expenseName: {
    flex: 2,
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "transparent"
  },

  expenseAmountBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "transparent"
  },

  expenseAmount: { flex: 1 },

  deleteBtn: { backgroundColor: "#ef4444", justifyContent: "center", alignItems: "center", paddingHorizontal: 12, borderRadius: 10 },

  addBtn: { backgroundColor: "#020617", flexDirection: "row", justifyContent: "center", alignItems: "center", padding: 12, borderRadius: 10, marginTop: 10, gap: 6 },

  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }]
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingTop: 10
  },

  totalLabel: {
    fontWeight: "600"
  },

  totalValue: {
    fontWeight: "700"
  },

  addText: { color: "white", fontWeight: "600" },

  calculateBtn: { backgroundColor: "#020617", flexDirection: "row", justifyContent: "center", alignItems: "center", padding: 14, borderRadius: 12, gap: 8, marginBottom: 16 },

  calculateText: { color: "white", fontWeight: "600", fontSize: 16 },

  errorText: { color: "#ef4444", fontSize: 12, marginTop: 4 },

  resultCard: { backgroundColor: "#ede9fe", borderRadius: 16, padding: 18 },

  resultTitle: { fontSize: 18, fontWeight: "700", color: "#6b21a8" },

  resultRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },

  resultLabel: { color: "#6b21a8" },

  resultValue: { fontWeight: "700", color: "#6b21a8" },

  divider: { height: 1, backgroundColor: "#c4b5fd", marginVertical: 12 },

  costText: { color: "#6b21a8" },

  costValue: { fontSize: 22, fontWeight: "800", color: "#4c1d95", marginTop: 4 },

  bottomButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 16, marginBottom: 10 },

  backBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#e5e7eb", padding: 14, borderRadius: 12, flex: 1, justifyContent: "center", marginRight: 8 },

  nextBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#020617", padding: 14, borderRadius: 12, flex: 1, justifyContent: "center", marginLeft: 8 },

  backText: { fontWeight: "600", color: "#020617" },

  nextText: { fontWeight: "600", color: "white" }
});