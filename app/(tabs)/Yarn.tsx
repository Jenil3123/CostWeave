/**
 * =========================================================
 * COSTWEAVE – Yarn Cost Calculator Screen
 * ---------------------------------------------------------
 * This screen calculates the yarn cost of a fabric using:
 * - Warp Yarn parameters
 * - Weft Yarn parameters
 * - Fabric specifications
 *
 * Author: Jenil Bhingradiya
 * Project: CostWeave
 * =========================================================
 */

import {
  Montserrat_500Medium,
  Montserrat_800ExtraBold,
  useFonts
} from "@expo-google-fonts/montserrat";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
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

export default function Yarn({ navigation }: any) {
  const [fontsLoaded] = useFonts({
    Montserrat_800ExtraBold,
    Montserrat_500Medium
  });

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const resetScale = useRef(new Animated.Value(1)).current;
  const nextScale = useRef(new Animated.Value(1)).current;

  const scrollRef = useRef<ScrollView | null>(null);
  const resultRef = useRef<View | null>(null);

  const warpRateRef = useRef<TextInput | null>(null);
  const warpWastageRef = useRef<TextInput | null>(null);
  const warpCountRef = useRef<TextInput | null>(null);
  const weftCountRef = useRef<TextInput | null>(null);
  const weftRateRef = useRef<TextInput | null>(null);
  const weftWastageRef = useRef<TextInput | null>(null);
  const widthRef = useRef<TextInput | null>(null);
  const endsRef = useRef<TextInput | null>(null);
  const ppiRef = useRef<TextInput | null>(null);

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

  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState({
    warpConsumption: 0,
    weftConsumption: 0,
    warpCost: 0,
    weftCost: 0,
    total: 0
  });

  useEffect(() => {
    if (showResult) {
      setTimeout(() => {
        if (resultRef.current && scrollRef.current) {
          resultRef.current.measureLayout(
            scrollRef.current as any,
            (_x: number, y: number) => {
              scrollRef.current?.scrollTo({
                y: y - 40,
                animated: true
              });
            }
          );
        }
      }, 250);
    }
  }, [showResult]);

  // ✅ Only block UI rendering here
  if (!fontsLoaded) {
    return null;
  }

  const resetResult =
    (setter: React.Dispatch<React.SetStateAction<string>>, field: string) =>
      (value: string) => {
        setter(value);
        setShowResult(false);
        setErrors((prev) => ({ ...prev, [field]: false }));
      };

  const calculateYarn = () => {

    const newErrors = {
      warpCount: !warpCount,
      warpRate: !warpRate,
      warpWastage: !warpWastage,
      weftCount: !weftCount,
      weftRate: !weftRate,
      weftWastage: !weftWastage,
      fabricWidth: !fabricWidth,
      totalEnds: !totalEnds,
      ppi: !ppi
    };

    setErrors(newErrors);

    if (Object.values(newErrors).includes(true)) {

      setTimeout(() => {

        if (newErrors.warpCount) {
          warpCountRef.current?.focus();
          scrollRef.current?.scrollTo({ y: 200, animated: true });
        }

        else if (newErrors.warpRate) {
          warpRateRef.current?.focus();
          scrollRef.current?.scrollTo({ y: 260, animated: true });
        }

        else if (newErrors.warpWastage) {
          warpWastageRef.current?.focus();
          scrollRef.current?.scrollTo({ y: 330, animated: true });
        }

        else if (newErrors.weftCount) {
          weftCountRef.current?.focus();
          scrollRef.current?.scrollTo({ y: 470, animated: true });
        }

        else if (newErrors.weftRate) {
          weftRateRef.current?.focus();
          scrollRef.current?.scrollTo({ y: 540, animated: true });
        }

        else if (newErrors.weftWastage) {
          weftWastageRef.current?.focus();
          scrollRef.current?.scrollTo({ y: 610, animated: true });
        }

        else if (newErrors.fabricWidth) {
          widthRef.current?.focus();
          scrollRef.current?.scrollTo({ y: 760, animated: true });
        }

        else if (newErrors.totalEnds) {
          endsRef.current?.focus();
          scrollRef.current?.scrollTo({ y: 830, animated: true });
        }

        else if (newErrors.ppi) {
          ppiRef.current?.focus();
          scrollRef.current?.scrollTo({ y: 900, animated: true });
        }

      }, 120);

      return;
    }

    Keyboard.dismiss();

    const warpConsumption =
      Number(totalEnds) / (Number(warpCount) * 840);

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

    setErrors({});
    setShowResult(false);

    setResults({
      warpConsumption: 0,
      weftConsumption: 0,
      warpCost: 0,
      weftCost: 0,
      total: 0
    });

    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={20}
      >

        <ScrollView
          ref={scrollRef}
          style={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{ paddingBottom: 70 }}
        >

          <View style={styles.logoTextContainer}>
            <Text style={styles.title}>
              <Text style={styles.cost}>COST</Text>
              <Text style={styles.weave}>WEAVE</Text>
            </Text>

            <Text style={styles.subtitle}>
              Precision Fabric Costing
            </Text>
          </View>

          <View style={styles.infoCard}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>

              <Image
                source={require("../../assets/images/icons/yarn-spool.png")}
                style={{ width: 24, height: 24, marginRight: 3 }}
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
            <View style={[styles.inputRow, errors.warpCount && styles.errorInput]}>
              <TextInput
                ref={warpCountRef}
                style={styles.inputField}
                placeholder="40.00"
                keyboardType="numeric"
                value={warpCount}
                onChangeText={resetResult(setWarpCount, "warpCount")}
                returnKeyType="next"
                onSubmitEditing={() => warpRateRef.current?.focus()}
              />
              <Text style={styles.unit}>Ne</Text>
            </View>
            {errors.warpCount && <Text style={styles.errorText}>Required field</Text>}

            <Text style={styles.label}>Warp Yarn Rate</Text>
            <View style={[styles.inputRow, errors.warpRate && styles.errorInput]}>
              <TextInput
                ref={warpRateRef}
                style={styles.inputField}
                placeholder="350"
                keyboardType="numeric"
                value={warpRate}
                onChangeText={resetResult(setWarpRate, "warpRate")}
                returnKeyType="next"
                onSubmitEditing={() => warpWastageRef.current?.focus()}
              />
              <Text style={styles.unit}>₹/kg</Text>
            </View>
            {errors.warpRate && <Text style={styles.errorText}>Required field</Text>}

            <Text style={styles.label}>Warp Wastage</Text>
            <View style={[styles.inputRow, errors.warpWastage && styles.errorInput]}>
              <TextInput
                ref={warpWastageRef}
                style={styles.inputField}
                placeholder="2"
                keyboardType="numeric"
                value={warpWastage}
                onChangeText={resetResult(setWarpWastage, "warpWastage")}
                returnKeyType="next"
                onSubmitEditing={() => weftCountRef.current?.focus()}
              />
              <Text style={styles.unit}>%</Text>
            </View>
            {errors.warpWastage && <Text style={styles.errorText}>Required field</Text>}
          </View>

          {/* WEFT */}

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Weft Yarn</Text>

            <Text style={styles.label}>Weft Yarn Count</Text>
            <View style={[styles.inputRow, errors.weftCount && styles.errorInput]}>
              <TextInput
                ref={weftCountRef}
                style={styles.inputField}
                placeholder="40.00"
                keyboardType="numeric"
                value={weftCount}
                onChangeText={resetResult(setWeftCount, "weftCount")}
                returnKeyType="next"
                onSubmitEditing={() => weftRateRef.current?.focus()}
              />
              <Text style={styles.unit}>Ne</Text>
            </View>
            {errors.weftCount && <Text style={styles.errorText}>Required field</Text>}

            <Text style={styles.label}>Weft Yarn Rate</Text>
            <View style={[styles.inputRow, errors.weftRate && styles.errorInput]}>
              <TextInput
                ref={weftRateRef}
                style={styles.inputField}
                placeholder="350"
                keyboardType="numeric"
                value={weftRate}
                onChangeText={resetResult(setWeftRate, "weftRate")}
                returnKeyType="next"
                onSubmitEditing={() => weftWastageRef.current?.focus()}
              />
              <Text style={styles.unit}>₹/kg</Text>
            </View>
            {errors.weftRate && <Text style={styles.errorText}>Required field</Text>}

            <Text style={styles.label}>Weft Wastage</Text>
            <View style={[styles.inputRow, errors.weftWastage && styles.errorInput]}>
              <TextInput
                ref={weftWastageRef}
                style={styles.inputField}
                placeholder="2"
                keyboardType="numeric"
                value={weftWastage}
                onChangeText={resetResult(setWeftWastage, "weftWastage")}
                returnKeyType="next"
                onSubmitEditing={() => widthRef.current?.focus()}
              />
              <Text style={styles.unit}>%</Text>
            </View>
            {errors.weftWastage && <Text style={styles.errorText}>Required field</Text>}
          </View>

          {/* FABRIC */}

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Fabric Specifications</Text>

            <Text style={styles.label}>Fabric Width</Text>
            <View style={[styles.inputRow, errors.fabricWidth && styles.errorInput]}>
              <TextInput
                ref={widthRef}
                style={styles.inputField}
                placeholder="58"
                keyboardType="numeric"
                value={fabricWidth}
                onChangeText={resetResult(setFabricWidth, "fabricWidth")}
                returnKeyType="next"
                onSubmitEditing={() => endsRef.current?.focus()}
              />
              <Text style={styles.unit}>inch</Text>
            </View>
            {errors.fabricWidth && <Text style={styles.errorText}>Required field</Text>}

            <Text style={styles.label}>Total Ends</Text>
            <View style={[styles.inputRow, errors.totalEnds && styles.errorInput]}>
              <TextInput
                ref={endsRef}
                style={styles.inputField}
                placeholder="2000"
                keyboardType="numeric"
                value={totalEnds}
                onChangeText={resetResult(setTotalEnds, "totalEnds")}
                returnKeyType="next"
                onSubmitEditing={() => ppiRef.current?.focus()}
              />
              <Text style={styles.unit}>ends</Text>
            </View>
            {errors.totalEnds && <Text style={styles.errorText}>Required field</Text>}

            <Text style={styles.label}>Picks Per Inch (PPI)</Text>
            <View style={[styles.inputRow, errors.ppi && styles.errorInput]}>
              <TextInput
                ref={ppiRef}
                style={styles.inputField}
                placeholder="80"
                keyboardType="numeric"
                value={ppi}
                onChangeText={resetResult(setPpi, "ppi")}
                returnKeyType="done"
                onSubmitEditing={calculateYarn}
              />
              <Text style={styles.unit}>PPI</Text>
            </View>
            {errors.ppi && <Text style={styles.errorText}>Required field</Text>}
          </View>

          {/* CALCULATE BUTTON */}

          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.button}
              onPress={calculateYarn}
            >
              <View style={styles.buttonContent}>
                <Ionicons name="calculator-outline" size={20} color="#fff" />
                <Text style={styles.buttonText}>Calculate Yarn Costing</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* RESET BUTTON */}

          <TouchableOpacity
            style={styles.resetButton}
            activeOpacity={0.85}
            onPress={resetForm}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="refresh-outline" size={20} color="#fff" />
              <Text style={styles.resetText}>Reset Yarn Values</Text>
            </View>
          </TouchableOpacity>

          {showResult && (
            <View ref={resultRef} style={styles.resultCard}>

              <Text style={styles.resultTitle}>Yarn Cost Breakdown</Text>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Warp Consumption</Text>
                <Text style={styles.resultValue}>
                  {results.warpConsumption.toFixed(4)} kg
                </Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Weft Consumption</Text>
                <Text style={styles.resultValue}>
                  {results.weftConsumption.toFixed(4)} kg
                </Text>
              </View>

              <View style={styles.resultDivider} />

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Warp Cost</Text>
                <Text style={styles.resultValue}>
                  ₹ {results.warpCost.toFixed(2)}
                </Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Weft Cost</Text>
                <Text style={styles.resultValue}>
                  ₹ {results.weftCost.toFixed(2)}
                </Text>
              </View>

              <View style={styles.resultTotal}>
                <Text style={styles.totalLabel}>Total Fabric Yarn Cost</Text>
                <Text style={styles.totalValue}>
                  ₹ {results.total.toFixed(2)}
                </Text>
              </View>
            </View>
          )}

          {showResult && (
            <Animated.View style={{ transform: [{ scale: nextScale }] }}>
              <TouchableOpacity
                style={styles.continueButton}
                activeOpacity={0.85}
                onPress={() => navigation.navigate("next")}
                onPressIn={() => {
                  Animated.spring(nextScale, {
                    toValue: 0.94,
                    friction: 6,
                    tension: 120,
                    useNativeDriver: true
                  }).start();
                }}
                onPressOut={() => {
                  Animated.spring(nextScale, {
                    toValue: 1,
                    friction: 6,
                    tension: 120,
                    useNativeDriver: true
                  }).start();
                }}
              >
                <View style={styles.buttonContent}>
                  <Text style={styles.continueText}>Continue to Fabric Cost</Text>
                  <Ionicons name="arrow-forward-outline" size={20} color="#fff" />
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f3f4f6"
  },

  /* ---------- LOGO HEADER ---------- */

  logoTextContainer: {
    alignItems: "center",
    marginBottom: 15,
  },

  title: {
    fontSize: 35,
    letterSpacing: 1,
    fontFamily: "Montserrat_800ExtraBold",
  },

  cost: {
    color: "#16294d",
    fontFamily: "Montserrat_800ExtraBold",
  },

  weave: {
    color: "#1d5bad",
    fontFamily: "Montserrat_800ExtraBold",
  },

  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    fontFamily: "Montserrat_800ExtraBold",
    letterSpacing: 0.6
  },

  /* ---------- INFO CARD ---------- */

  infoCard: {
    backgroundColor: "#dbeafe",
    padding: 16,
    borderRadius: 14,
    marginBottom: 20
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: "700"
  },

  infoDesc: {
    color: "#1f2937",
    marginTop: 2
  },

  /* ---------- FORM CARDS ---------- */

  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 4
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10
  },

  label: {
    marginTop: 12,
    marginBottom: 5,
    fontWeight: "500",
    color: "#374151"
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 4
  },

  inputField: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15
  },

  unit: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280"
  },

  errorInput: {
    borderWidth: 1.5,
    borderColor: "#ef4444"
  },

  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginBottom: 6
  },

  /* ---------- BUTTONS ---------- */

  button: {
    backgroundColor: "#2563eb",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8
  },

  resetButton: {
    backgroundColor: "#ef4444",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 25,
    marginTop: 5
  },

  resetText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    marginLeft: 8
  },

  continueButton: {
    backgroundColor: "#10b981",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 15,
    marginBottom: 30
  },

  continueText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8
  },

  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },

  /* ---------- RESULTS ---------- */

  resultCard: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 18,
    marginTop: 10,
    elevation: 5
  },

  resultTitle: {
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 16,
    color: "#111827"
  },

  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12
  },

  resultLabel: {
    color: "#374151",
    fontSize: 14
  },

  resultValue: {
    fontWeight: "600",
    fontSize: 15
  },

  resultDivider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 10
  },

  resultTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: "#e5e7eb"
  },

  totalLabel: {
    fontSize: 16,
    fontWeight: "700"
  },

  totalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2563eb"
  },

  resultLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  }

});