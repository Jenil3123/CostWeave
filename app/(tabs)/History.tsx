import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/* -------- Helper -------- */

const formatCurrency = (num: number) => {
  return new Intl.NumberFormat("en-IN").format(num);
};

export default function History() {

  const router = useRouter();
  const [history, setHistory] = useState<any[]>([]);

  const loadHistory = async () => {
    try {

      const data = await AsyncStorage.getItem("fabricHistory");

      if (data) {
        setHistory(JSON.parse(data));
      } else {
        setHistory([]);
      }

    } catch (error) {
      console.log("History load error", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  /* -------- Start New Calculation -------- */

  const startNewCalculation = async () => {

    await AsyncStorage.removeItem("currentCalculation");

    router.push("/(tabs)/Yarn");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >

        {/* Header */}

        <View style={styles.headerCard}>
          <Ionicons name="save-outline" size={22} color="#4338ca" />
          <View>
            <Text style={styles.headerTitle}>
              Calculation History
            </Text>
            <Text style={styles.headerSub}>
              Saved fabric costings and calculations
            </Text>
          </View>
        </View>

        {/* New Calculation Button */}

        <Pressable
          style={styles.newCalcButton}
          onPress={startNewCalculation}
        >
          <Ionicons name="refresh-outline" size={18} color="white" />
          <Text style={styles.newCalcText}>
            New Calculation
          </Text>
        </Pressable>

        {/* Empty State */}

        {history.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="document-outline" size={40} color="#9ca3af" />
            <Text style={styles.emptyText}>
              No saved calculations yet
            </Text>
          </View>
        )}

        {/* History Cards */}

        {history.map((item) => (

          <View key={item.id} style={styles.card}>

            <Text style={styles.fabricName}>
              {item.fabricName}
            </Text>

            <Text style={styles.date}>
              {item.date}
            </Text>

            {item.notes ? (
              <Text style={styles.notes}>
                {item.notes}
              </Text>
            ) : null}

            {/* Metric Boxes */}

            <View style={styles.metricRow}>

              <View style={styles.metricBoxBlue}>
                <Text style={styles.metricLabel}>
                  Total Meters
                </Text>
                <Text style={styles.metricValue}>
                  {item.totalMeters ?? "-"} m
                </Text>
              </View>

              <View style={styles.metricBoxGreen}>
                <Text style={styles.metricLabel}>
                  Cost / Meter
                </Text>
                <Text style={styles.metricValue}>
                  ₹ {formatCurrency(item.finalPrice)}
                </Text>
              </View>

            </View>

            {/* Divider */}

            <View style={styles.divider} />

            {/* Action Buttons */}

            <View style={styles.actionRow}>

              <Pressable style={styles.iconButton}>
                <Ionicons name="eye-outline" size={20} color="#374151" />
              </Pressable>

              <Pressable style={styles.iconButton}>
                <Ionicons name="create-outline" size={18} />
              </Pressable>

              <Pressable style={styles.iconButton}>
                <Ionicons name="copy-outline" size={18} />
              </Pressable>

              <Pressable style={styles.iconButton}>
                <Ionicons name="share-social-outline" size={18} />
              </Pressable>

              <Pressable style={styles.iconButton}>
                <Ionicons name="trash-outline" size={20} color="#ef4444" />
              </Pressable>

            </View>

          </View>

        ))}

      </ScrollView>

    </SafeAreaView>
  );
}

/* -------- Styles -------- */

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
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#c7d2fe"
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4338ca"
  },

  headerSub: {
    color: "#4f46e5"
  },

  newCalcButton: {
    flexDirection: "row",
    backgroundColor: "#111827",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 18
  },

  newCalcText: {
    color: "white",
    fontWeight: "600"
  },

  emptyState: {
    alignItems: "center",
    marginTop: 60
  },

  emptyText: {
    marginTop: 10,
    color: "#6b7280"
  },

  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb"
  },

  fabricName: {
    fontSize: 18,
    fontWeight: "700"
  },

  date: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 4
  },

  notes: {
    marginTop: 4,
    color: "#374151"
  },

  metricRow: {
    flexDirection: "row",
    marginTop: 14,
    gap: 10
  },

  metricBoxBlue: {
    flex: 1,
    backgroundColor: "#e0e7ff",
    borderRadius: 12,
    padding: 12
  },

  metricBoxGreen: {
    flex: 1,
    backgroundColor: "#d1fae5",
    borderRadius: 12,
    padding: 12
  },

  metricLabel: {
    fontSize: 13,
    color: "#374151"
  },

  metricValue: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 4
  },

  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 14
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between"
  },

  iconButton: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center"
  }

});