import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system/legacy";
import * as Print from "expo-print";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { useCallback, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text, TextInput, View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../../assets/images/costweave-app-icon.png";

/* -------- Helper -------- */

const formatCurrency = (num: number) => {
  return new Intl.NumberFormat("en-IN").format(num);
};

const formatNumber = (num: number) => {
  return new Intl.NumberFormat("en-IN").format(num);
};

export default function History() {

  const router = useRouter();
  const { highlightId } = useLocalSearchParams();
  const [copyModalVisible, setCopyModalVisible] = useState(false);
  const [copiedFileName, setCopiedFileName] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  const [history, setHistory] = useState<any[]>([]);
  const [hasHighlighted, setHasHighlighted] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewItem, setViewItem] = useState<any>(null);

  /* -------- EDIT STATE -------- */

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const deleteAnim = useState(new Animated.Value(1))[0];

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#e5e7eb", "#1d5bad"]
  });

  /* -------- View Calculation -------- */

  const viewCalculation = (item: any) => {
    console.log("VIEW ITEM:", item);
    setViewItem(item);
    setViewModalVisible(true);
  };

  /* -------- Edit Calculation -------- */

  const editCalculation = (item: any) => {

    const normalizedItem = {
      warpCount: 0,
      warpRate: 0,
      warpWastage: 0,

      weftCount: 0,
      weftRate: 0,
      weftWastage: 0,

      fabricWidth: 0,
      totalEnds: 0,
      ppi: 0,

      salary: 0,
      electricity: 0,
      maintenance: 0,

      totalMeters: 0,

      otherExpenses: [],

      ...item
    };

    setEditItem(normalizedItem);
    setEditModalVisible(true);

  };

  /* -------- Other Expense Helpers -------- */

  const addOtherExpense = () => {

    const updated = [
      ...(editItem?.otherExpenses || []),
      { name: "", amount: 0 }
    ];

    setEditItem({ ...editItem, otherExpenses: updated });

  };

  const removeOtherExpense = (index: number) => {

    const updated = [...(editItem?.otherExpenses || [])];
    updated.splice(index, 1);

    setEditItem({ ...editItem, otherExpenses: updated });

  };

  /* -------- Share PDF -------- */

  const shareCalculationPDF = async (item: any) => {
    try {

      /* ---------- Load Logo ---------- */

      const asset = Asset.fromModule(logo);
      await asset.downloadAsync();

      const base64 = await FileSystem.readAsStringAsync(asset.localUri!, {
        encoding: "base64",
      });

      const logoBase64 = `data:image/png;base64,${base64}`;

      /* ---------- Unique File Name ---------- */

      const now = new Date();

      const timestamp =
        now.getFullYear() +
        String(now.getMonth() + 1).padStart(2, "0") +
        String(now.getDate()).padStart(2, "0") +
        "_" +
        String(now.getHours()).padStart(2, "0") +
        String(now.getMinutes()).padStart(2, "0") +
        String(now.getSeconds()).padStart(2, "0");

      const safeFabricName = (item.fabricName || "Fabric")
        .replace(/\s+/g, "_")
        .replace(/[^\w]/g, "");

      const fileName = `CostWeave_${safeFabricName}_${timestamp}.pdf`;

      /* ---------- HTML Template ---------- */

      const html = `
<html>
<head>
<style>

body{
  font-family: Arial, Helvetica, sans-serif;
  padding: 30px;
  color:#111827;
}

.header{
  display:flex;
  align-items:center;
  justify-content:space-between;
  border-bottom:2px solid #e5e7eb;
  padding-bottom:15px;
  margin-bottom:25px;
}

.logo{
  height:55px;
}

.app{
  font-size:22px;
  font-weight:bold;
}

.report{
  color:#6b7280;
}

.info{
  margin-top:15px;
  margin-bottom:20px;
  font-size:14px;
}

.section{
  margin-top:25px;
}

.section-title{
  font-size:16px;
  font-weight:bold;
  margin-bottom:10px;
}

table{
  width:100%;
  border-collapse:collapse;
}

td{
  padding:8px;
  border-bottom:1px solid #e5e7eb;
}

.label{
  color:#6b7280;
}

.value{
  text-align:right;
  font-weight:500;
}

.final-box{
  margin-top:25px;
  padding:15px;
  background:#ecfdf5;
  border:1px solid #d1fae5;
  border-radius:8px;
  font-size:18px;
  font-weight:bold;
  color:#047857;
}

.footer{
  margin-top:60px;
  padding-top:10px;
  border-top:1px solid #e5e7eb;
  text-align:center;
  font-size:12px;
  color:#6b7280;
}

</style>
</head>

<body>

<div class="header">

<div>
<div class="app">CostWeave</div>
<div class="report">Fabric Costing Report</div>
</div>

<img src="${logoBase64}" class="logo"/>

</div>

<div class="info">
<b>Fabric:</b> ${item.fabricName}<br/>
<b>Date:</b> ${item.date}
</div>

${item.notes ? `
<div class="section">
<div class="section-title">Notes</div>
<p>${item.notes}</p>
</div>
` : ""}

<div class="section">
<div class="section-title">Yarn Details</div>

<table>

<tr>
<td class="label">Warp Count</td>
<td class="value">${item.warpCount ?? "-"} Ne</td>
</tr>

<tr>
<td class="label">Weft Count</td>
<td class="value">${item.weftCount ?? "-"} Ne</td>
</tr>

<tr>
<td class="label">Fabric Width</td>
<td class="value">${item.fabricWidth ?? "-"} inch</td>
</tr>

<tr>
<td class="label">Total Ends</td>
<td class="value">${formatNumber(item.totalEnds ?? 0)}</td>
</tr>

<tr>
<td class="label">PPI</td>
<td class="value">${item.ppi ?? "-"}</td>
</tr>

</table>
</div>

<div class="section">
<div class="section-title">Production Summary</div>

<table>
<tr>
<td class="label">Total Meters</td>
<td class="value">${formatNumber(item.totalMeters ?? 0)} m</td>
</tr>
</table>

</div>

<div class="section">
<div class="section-title">Costing</div>

<table>

<tr>
<td class="label">Yarn Cost</td>
<td class="value">₹ ${formatCurrency(item.yarnCost ?? 0)} /m</td>
</tr>

<tr>
<td class="label">Manufacturing Cost</td>
<td class="value">₹ ${formatCurrency(item.manufacturingCost ?? 0)} /m</td>
</tr>

<tr>
<td class="label">Total Cost</td>
<td class="value">
₹ ${formatCurrency((item.yarnCost ?? 0) + (item.manufacturingCost ?? 0))} /m
</td>
</tr>

</table>
</div>

<div class="final-box">
Final Fabric Price: ₹ ${formatCurrency(item.finalPrice ?? 0)} / meter
</div>

<div class="footer">
Generated by <b>CostWeave</b><br/>
Fabric Costing Application<br/>
© ${new Date().getFullYear()} CostWeave
</div>

</body>
</html>
`;

      /* ---------- Generate PDF ---------- */

      const { uri } = await Print.printToFileAsync({
        html,
        base64: false
      });

      const newPath = FileSystem.documentDirectory + fileName;

      await FileSystem.copyAsync({
        from: uri,
        to: newPath
      });

      /* ---------- Share PDF ---------- */

      await Sharing.shareAsync(newPath);

    } catch (error) {
      console.log("PDF share error:", error);
    }
  };

  /* -------- Share Calculation -------- */

  const shareCalculation = async (item: any) => {
    try {

      const message =
        `Fabric Costing Calculation

          Fabric: ${item.fabricName}
          Date: ${item.date}

          Total Meters: ${formatNumber(item.totalMeters)} m

          Yarn Cost: ₹ ${formatCurrency(item.yarnCost || 0)}/m
          Manufacturing Cost: ₹ ${formatCurrency(item.manufacturingCost || 0)}/m

          Final Price: ₹ ${formatCurrency(item.finalPrice)}/m
          `;

      await Share.share({
        message: message
      });

    } catch (error) {
      console.log("Share error:", error);
    }
  };

  /* -------- Copy Calculation -------- */

  const copyCalculation = async (item: any) => {
    try {

      const copiedItem = {
        ...item,
        id: Date.now(),
        fabricName: `${item.fabricName} (copy)`,
        date: new Date().toLocaleString()
      };

      const updatedHistory = [copiedItem, ...history];

      setHistory(updatedHistory);

      await AsyncStorage.setItem(
        "fabricHistory",
        JSON.stringify(updatedHistory)
      );

      /* set popup filename */

      setCopiedFileName(copiedItem.fabricName);

      /* force popup reset to avoid bug */

      setCopyModalVisible(false);

      setTimeout(() => {
        setCopyModalVisible(true);
      }, 50);

      /* highlight copied card */

      setCopiedId(copiedItem.id);

      borderAnim.setValue(0);

      Animated.sequence([
        Animated.timing(borderAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: false
        }),
        Animated.timing(borderAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: false
        }),
        Animated.timing(borderAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: false
        }),
        Animated.timing(borderAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: false
        })
      ]).start();

      /* scroll to top so user sees copied file */

      setTimeout(() => {
        scrollRef.current?.scrollTo({ y: 0, animated: true });
      }, 200);

    } catch (error) {
      console.log("Copy calculation error:", error);
    }
  };

  /* -------- Recalculation Function ---------*/

  const recalculateCost = (data: any) => {

    if (!data) return data;

    /* -------- Yarn Cost -------- */

    const warpCost =
      ((data.warpRate || 0) / (data.warpCount || 1)) *
      (1 + (data.warpWastage || 0) / 100);

    const weftCost =
      ((data.weftRate || 0) / (data.weftCount || 1)) *
      (1 + (data.weftWastage || 0) / 100);

    const yarnCost = warpCost + weftCost;

    /* -------- Production Cost -------- */

    const otherExpensesTotal =
      data.otherExpenses?.reduce(
        (sum: number, e: any) => sum + Number(e.amount || 0),
        0
      ) || 0;

    const manufacturingCost =
      Number(data.salary || 0) +
      Number(data.electricity || 0) +
      Number(data.maintenance || 0) +
      otherExpensesTotal;

    /* -------- Final Price -------- */

    const finalPrice = yarnCost + manufacturingCost;

    return {
      ...data,
      yarnCost,
      manufacturingCost,
      finalPrice
    };

  };

  /* -------- Save Edited Calculation -------- */

  const saveEditedCalculation = async () => {

    try {

      if (!editItem) return;

      /* -------- Yarn Cost -------- */

      const warpCost =
        ((editItem.warpRate || 0) / (editItem.warpCount || 1)) *
        (1 + (editItem.warpWastage || 0) / 100);

      const weftCost =
        ((editItem.weftRate || 0) / (editItem.weftCount || 1)) *
        (1 + (editItem.weftWastage || 0) / 100);

      const yarnCost = warpCost + weftCost;

      /* -------- Production Cost -------- */

      const otherExpensesTotal =
        editItem.otherExpenses?.reduce(
          (sum: number, e: any) => sum + Number(e.amount || 0),
          0
        ) || 0;

      const productionCost =
        Number(editItem.salary || 0) +
        Number(editItem.electricity || 0) +
        Number(editItem.maintenance || 0) +
        otherExpensesTotal;

      /* -------- Final Price -------- */

      const finalPrice = yarnCost + productionCost;

      const updatedItem = {
        ...editItem,
        yarnCost,
        manufacturingCost: productionCost,
        finalPrice
      };

      const updatedHistory = history.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      );

      setHistory(updatedHistory);

      await AsyncStorage.setItem(
        "fabricHistory",
        JSON.stringify(updatedHistory)
      );

      setEditModalVisible(false);

    } catch (error) {
      console.log("Edit save error:", error);
    }

  };

  /* -------- Load History -------- */

  const loadHistory = async () => {
    try {

      const data = await AsyncStorage.getItem("fabricHistory");

      if (data) {
        setHistory(JSON.parse(data));
      } else {
        setHistory([]);
      }

      if (highlightId && !hasHighlighted) {

        Animated.sequence([
          Animated.timing(borderAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false
          }),
          Animated.timing(borderAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false
          }),
          Animated.timing(borderAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false
          }),
          Animated.timing(borderAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false
          })
        ]).start(() => {

          setHasHighlighted(true);
          router.replace("/(tabs)/History");

        });

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

  /* -------- Print Calculation -------- */

  const printCalculation = async (item: any) => {
    try {

      const asset = Asset.fromModule(logo);
      await asset.downloadAsync();

      const base64 = await FileSystem.readAsStringAsync(asset.localUri!, {
        encoding: "base64",
      });

      const logoBase64 = `data:image/png;base64,${base64}`;

      const html = `
<html>
<head>
<style>

body{
  font-family: Arial, Helvetica, sans-serif;
  padding: 30px;
  color:#111827;
}

.header{
  display:flex;
  align-items:center;
  justify-content:space-between;
  border-bottom:2px solid #e5e7eb;
  padding-bottom:15px;
  margin-bottom:25px;
}

.logo{
  height:55px;
}

.app{
  font-size:22px;
  font-weight:bold;
}

.report{
  color:#6b7280;
}

.section{
  margin-top:20px;
}
  .footer{
  margin-top:60px;
  padding-top:10px;
  border-top:1px solid #e5e7eb;
  text-align:center;
  font-size:12px;
  color:#6b7280;
}

table{
  width:100%;
  border-collapse:collapse;
}

td{
  padding:8px;
  border-bottom:1px solid #e5e7eb;
}

.label{
  color:#6b7280;
}

.value{
  text-align:right;
  font-weight:500;
}

.final-box{
  margin-top:25px;
  padding:15px;
  background:#ecfdf5;
  border:1px solid #d1fae5;
  border-radius:8px;
  font-size:18px;
  font-weight:bold;
  color:#047857;
}

</style>
</head>

<body>

<div class="header">

<div>
<div class="app">CostWeave</div>
<div class="report">Fabric Costing Report</div>
</div>

<img src="${logoBase64}" class="logo"/>

</div>

<p><b>Fabric:</b> ${item.fabricName}</p>
<p><b>Date:</b> ${item.date}</p>

<div class="section">
<h3>Yarn Details</h3>

<table>
<tr>
<td class="label">Warp Count</td>
<td class="value">${item.warpCount ?? "-"} Ne</td>
</tr>

<tr>
<td class="label">Weft Count</td>
<td class="value">${item.weftCount ?? "-"} Ne</td>
</tr>

<tr>
<td class="label">Fabric Width</td>
<td class="value">${item.fabricWidth ?? "-"} inch</td>
</tr>

<tr>
<td class="label">Total Ends</td>
<td class="value">${formatNumber(item.totalEnds ?? 0)}</td>
</tr>

<tr>
<td class="label">PPI</td>
<td class="value">${item.ppi ?? "-"}</td>
</tr>
</table>
</div>

<div class="section">
<h3>Production</h3>

<table>
<tr>
<td class="label">Total Meters</td>
<td class="value">${formatNumber(item.totalMeters ?? 0)} m</td>
</tr>
</table>
</div>

<div class="section">
<h3>Costing</h3>

<table>
<tr>
<td class="label">Yarn Cost</td>
<td class="value">₹ ${formatCurrency(item.yarnCost ?? 0)} /m</td>
</tr>

<tr>
<td class="label">Manufacturing Cost</td>
<td class="value">₹ ${formatCurrency(item.manufacturingCost ?? 0)} /m</td>
</tr>

<tr>
<td class="label">Total Cost</td>
<td class="value">
₹ ${formatCurrency((item.yarnCost ?? 0) + (item.manufacturingCost ?? 0))} /m
</td>
</tr>
</table>
</div>

<div class="final-box">
Final Fabric Price: ₹ ${formatCurrency(item.finalPrice ?? 0)} / meter
</div>
<div class="footer">
Generated by <b>CostWeave</b><br/>
Fabric Costing Application<br/>
© ${new Date().getFullYear()} CostWeave
</div>

</body>
</html>
`;

      await Print.printAsync({
        html
      });

    } catch (error) {
      console.log("Print error:", error);
    }
  };

  /* -------- Delete Calculation -------- */

  const deleteCalculation = async () => {
    if (!selectedItem) return;

    const idToDelete = selectedItem.id;

    setDeleteModalVisible(false);

    setTimeout(() => {

      setDeletingId(idToDelete);

      Animated.timing(deleteAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true
      }).start(async () => {
        try {

          const existing = await AsyncStorage.getItem("fabricHistory");
          if (!existing) return;

          const parsed = JSON.parse(existing);

          const updated = parsed.filter(
            (item: any) => item.id !== idToDelete
          );

          await AsyncStorage.setItem(
            "fabricHistory",
            JSON.stringify(updated)
          );

          setHistory(updated);

          deleteAnim.setValue(1);
          setDeletingId(null);

        } catch (error) {
          console.log("Delete calculation error:", error);
        }
      });

    }, 200);
  };

  /* -------- Start New Calculation -------- */

  const startNewCalculation = async () => {
    await AsyncStorage.removeItem("currentCalculation");
    router.push("/(tabs)/Yarn");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >

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

        <Pressable
          style={styles.newCalcButton}
          onPress={startNewCalculation}
        >
          <Ionicons name="refresh-outline" size={18} color="white" />
          <Text style={styles.newCalcText}>
            New Calculation
          </Text>
        </Pressable>

        {history.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="document-outline" size={40} color="#9ca3af" />
            <Text style={styles.emptyText}>
              No saved calculations yet
            </Text>
          </View>
        )}

        {history.map((item) => {

          const isHighlighted =
            Number(highlightId) === item.id || copiedId === item.id;
          return (
            <Animated.View
              key={item.id}
              style={[
                styles.card,
                isHighlighted && {
                  borderColor: borderColor,
                  borderWidth: 2
                },
                deletingId === item.id && {
                  opacity: deleteAnim,
                  transform: [{ scale: deleteAnim }]
                }
              ]}
            >

              <Text style={styles.fabricName}>{item.fabricName}</Text>
              <Text style={styles.date}>{item.date}</Text>

              {item.notes ? (
                <Text style={styles.notes}>{item.notes}</Text>
              ) : null}

              <View style={styles.metricRow}>

                <View style={styles.metricBoxBlue}>
                  <Text style={styles.metricLabel}>Total Meters</Text>
                  <Text style={styles.metricValue}>
                    {item.totalMeters ? formatNumber(item.totalMeters) : "-"} m
                  </Text>
                </View>

                <View style={styles.metricBoxGreen}>
                  <Text style={styles.metricLabel}>Cost / Meter</Text>
                  <Text style={styles.metricValue}>
                    ₹ {formatCurrency(item.finalPrice)}
                  </Text>
                </View>

              </View>

              <View style={styles.divider} />

              <View style={styles.actionRow}>

                <Pressable
                  style={styles.iconButton}
                  onPress={() => viewCalculation(item)}
                >
                  <Ionicons name="eye-outline" size={20} color="#374151" />
                </Pressable>

                <Pressable
                  style={styles.iconButton}
                  onPress={() => editCalculation(item)}
                >
                  <Ionicons name="create-outline" size={18} />
                </Pressable>

                <Pressable
                  style={styles.iconButton}
                  onPress={() => copyCalculation(item)}
                >
                  <Ionicons name="copy-outline" size={18} />
                </Pressable>

                <Pressable
                  style={styles.iconButton}
                  onPress={() => shareCalculationPDF(item)}
                >
                  <Ionicons name="share-social-outline" size={18} />
                </Pressable>

                <Pressable
                  style={styles.iconButton}
                  onPress={() => {
                    setSelectedItem(item);
                    setDeleteModalVisible(true);
                  }}
                >
                  <Ionicons name="trash-outline" size={20} color="#ef4444" />
                </Pressable>

              </View>

            </Animated.View>
          );
        })}

      </ScrollView>

      {/* -------- VIEW MODAL -------- */}

      <Modal visible={viewModalVisible} transparent animationType="slide">

        <View style={styles.modalOverlay}>

          <View style={styles.viewModalCard}>
            <Pressable
              style={styles.closeIcon}
              onPress={() => setViewModalVisible(false)}
            >
              <Ionicons name="close" size={20} color="#111827" />
            </Pressable>

            <ScrollView showsVerticalScrollIndicator={false}>

              <Text style={styles.viewTitle}>{viewItem?.fabricName}</Text>
              <Text style={styles.viewDate}>{viewItem?.date}</Text>

              {viewItem?.notes && (
                <>
                  <Text style={styles.sectionTitle}>Notes</Text>
                  <Text style={styles.notes}>{viewItem.notes}</Text>
                </>
              )}

              <Text style={styles.sectionTitle}>Yarn Details</Text>

              <View style={styles.detailRow}>
                <Text style={styles.label}>Warp Count</Text>
                <Text style={styles.value}>
                  {viewItem?.warpCount !== undefined ? `${viewItem.warpCount} Ne` : "-"}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.label}>Weft Count</Text>
                <Text style={styles.value}>
                  {viewItem?.weftCount !== undefined ? `${viewItem.weftCount} Ne` : "-"}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.label}>Fabric Width</Text>
                <Text style={styles.value}>
                  {viewItem?.fabricWidth !== undefined ? `${viewItem.fabricWidth} inch` : "-"}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.label}>Total Ends</Text>
                <Text style={styles.value}>
                  {viewItem?.totalEnds !== undefined
                    ? `${formatNumber(viewItem.totalEnds)} ends`
                    : "-"}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.label}>PPI</Text>
                <Text style={styles.value}>
                  {viewItem?.ppi !== undefined ? `${viewItem.ppi} picks/inch` : "-"}
                </Text>
              </View>

              <View style={styles.separator} />

              <Text style={styles.sectionTitle}>Production Summary</Text>

              <View style={styles.detailRow}>
                <Text style={styles.label}>Total Meters</Text>
                <Text style={styles.value}>
                  {viewItem?.totalMeters !== undefined
                    ? `${formatNumber(viewItem.totalMeters)} m`
                    : "-"}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.label}>Manufacturing Cost</Text>
                <Text style={styles.value}>
                  ₹ {formatCurrency(
                    (viewItem?.manufacturingCost || 0) *
                    (viewItem?.totalMeters || 0)
                  )}
                </Text>
              </View>

              <View style={styles.separator} />


              <Text style={styles.sectionTitle}>Final Costing</Text>

              <View style={styles.detailRow}>
                <Text style={styles.label}>Yarn Cost</Text>
                <Text style={styles.value}>
                  ₹ {formatCurrency(
                    viewItem?.yarnCost ||
                    viewItem?.yarnCostPerMeter ||
                    0
                  )}/m
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.label}>Manufacturing</Text>
                <Text style={styles.value}>
                  ₹ {formatCurrency(
                    viewItem?.manufacturingCost ||
                    viewItem?.manufacturing ||
                    viewItem?.productionCost ||
                    0
                  )}/m
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.label}>Total Cost</Text>
                <Text style={styles.value}>
                  ₹ {formatCurrency(
                    (viewItem?.yarnCost || 0) +
                    (viewItem?.manufacturingCost || 0)
                  )}/m
                </Text>
              </View>

              <Text style={styles.finalPrice}>
                Final Price: ₹ {formatCurrency(viewItem?.finalPrice || 0)}/m
              </Text>

              <Pressable
                style={styles.shareButton}
                onPress={() => shareCalculationPDF(viewItem)}
              >
                <Ionicons name="share-outline" size={18} color="white" />
                <Text style={styles.shareText}>Share</Text>
              </Pressable>

              <Pressable
                style={styles.printButton}
                onPress={() => printCalculation(viewItem)}
              >
                <Ionicons name="print-outline" size={18} color="white" />
                <Text style={styles.printText}>Print</Text>
              </Pressable>

            </ScrollView>

          </View>

        </View>

      </Modal>

      {/* -------- EDIT MODAL -------- */}

      <Modal visible={editModalVisible} transparent animationType="slide">

        <View style={styles.modalOverlay}>

          <View style={styles.viewModalCard}>

            <Pressable
              style={styles.closeIcon}
              onPress={() => setEditModalVisible(false)}
            >
              <Ionicons name="close" size={20} color="#111827" />
            </Pressable>

            <Text style={styles.viewTitle}>Edit Calculation</Text>

            <ScrollView showsVerticalScrollIndicator={false}>

              {/* -------- Fabric Info -------- */}

              <Text style={styles.sectionTitle}>Fabric Info</Text>

              <View style={styles.editRow}>
                <Text style={styles.editLabel}>Fabric Name</Text>

                <TextInput
                  style={styles.editInputWide}
                  value={editItem?.fabricName || ""}
                  onChangeText={(text) =>
                    setEditItem({ ...editItem, fabricName: text })
                  }
                />
              </View>

              <View style={styles.editRow}>
                <Text style={styles.editLabel}>Notes</Text>

                <TextInput
                  style={styles.editInputWide}
                  value={editItem?.notes || ""}
                  onChangeText={(text) =>
                    setEditItem({ ...editItem, notes: text })
                  }
                />
              </View>

              <View style={styles.sectionDivider} />

              {/* -------- Warp Yarn -------- */}

              <Text style={styles.sectionTitle}>Warp Yarn</Text>

              <View style={styles.editRow}>
                <Text style={styles.editLabel}>Warp Count</Text>

                <TextInput
                  style={styles.editInput}
                  keyboardType="numeric"
                  value={editItem?.warpCount?.toString() || ""}
                  onChangeText={(text) =>
                    setEditItem((prev: any) =>
                      recalculateCost({ ...prev, warpCount: Number(text) })
                    )}
                />
              </View>

              <View style={styles.editRow}>
                <Text style={styles.editLabel}>Warp Rate</Text>

                <TextInput
                  style={styles.editInput}
                  keyboardType="numeric"
                  value={editItem?.warpRate?.toString() || ""}
                  onChangeText={(text) =>
                    setEditItem((prev: any) =>
                      recalculateCost({ ...prev, warpRate: Number(text) })
                    )}
                />
              </View>

              <View style={styles.editRow}>
                <Text style={styles.editLabel}>Warp Wastage %</Text>

                <TextInput
                  style={styles.editInput}
                  keyboardType="numeric"
                  value={editItem?.warpWastage?.toString() || ""}
                  onChangeText={(text) =>
                    setEditItem({ ...editItem, warpWastage: Number(text) })
                  }
                />
              </View>

              <View style={styles.sectionDivider} />

              {/* -------- Weft Yarn -------- */}

              <Text style={styles.sectionTitle}>Weft Yarn</Text>

              <View style={styles.editRow}>
                <Text style={styles.editLabel}>Weft Count</Text>

                <TextInput
                  style={styles.editInput}
                  keyboardType="numeric"
                  value={editItem?.weftCount?.toString() || ""}
                  onChangeText={(text) =>
                    setEditItem({ ...editItem, weftCount: Number(text) })
                  }
                />
              </View>

              <View style={styles.editRow}>
                <Text style={styles.editLabel}>Weft Rate</Text>

                <TextInput
                  style={styles.editInput}
                  keyboardType="numeric"
                  value={editItem?.weftRate?.toString() || ""}
                  onChangeText={(text) =>
                    setEditItem({ ...editItem, weftRate: Number(text) })
                  }
                />
              </View>

              <View style={styles.editRow}>
                <Text style={styles.editLabel}>Weft Wastage %</Text>

                <TextInput
                  style={styles.editInput}
                  keyboardType="numeric"
                  value={editItem?.weftWastage?.toString() || ""}
                  onChangeText={(text) =>
                    setEditItem({ ...editItem, weftWastage: Number(text) })
                  }
                />
              </View>

              <View style={styles.sectionDivider} />

              {/* -------- Fabric -------- */}

              <Text style={styles.sectionTitle}>Fabric</Text>

              <View style={styles.editRow}>
                <Text style={styles.editLabel}>Fabric Width</Text>

                <TextInput
                  style={styles.editInput}
                  keyboardType="numeric"
                  value={editItem?.fabricWidth?.toString() || ""}
                  onChangeText={(text) =>
                    setEditItem({ ...editItem, fabricWidth: Number(text) })
                  }
                />
              </View>

              <View style={styles.editRow}>
                <Text style={styles.editLabel}>Total Ends</Text>

                <TextInput
                  style={styles.editInput}
                  keyboardType="numeric"
                  value={editItem?.totalEnds?.toString() || ""}
                  onChangeText={(text) =>
                    setEditItem({ ...editItem, totalEnds: Number(text) })
                  }
                />
              </View>

              <View style={styles.editRow}>
                <Text style={styles.editLabel}>PPI</Text>

                <TextInput
                  style={styles.editInput}
                  keyboardType="numeric"
                  value={editItem?.ppi?.toString() || ""}
                  onChangeText={(text) =>
                    setEditItem({ ...editItem, ppi: Number(text) })
                  }
                />
              </View>

              <View style={styles.sectionDivider} />

              {/* -------- Production Cost -------- */}

              <Text style={styles.sectionTitle}>Production Cost</Text>

              <View style={styles.editRow}>
                <Text style={styles.editLabel}>Salary</Text>

                <TextInput
                  style={styles.editInput}
                  keyboardType="numeric"
                  value={editItem?.salary?.toString() || ""}
                  onChangeText={(text) =>
                    setEditItem((prev: any) =>
                      recalculateCost({ ...prev, salary: Number(text) })
                    )
                  }
                />
              </View>

              <View style={styles.editRow}>
                <Text style={styles.editLabel}>Electricity</Text>

                <TextInput
                  style={styles.editInput}
                  keyboardType="numeric"
                  value={editItem?.electricity?.toString() || ""}
                  onChangeText={(text) =>
                    setEditItem((prev: any) => ({
                      ...prev,
                      electricity: Number(text)
                    }))}
                />
              </View>

              <View style={styles.editRow}>
                <Text style={styles.editLabel}>Maintenance</Text>

                <TextInput
                  style={styles.editInput}
                  keyboardType="numeric"
                  value={editItem?.maintenance?.toString() || ""}
                  onChangeText={(text) =>
                    setEditItem({ ...editItem, maintenance: Number(text) })
                  }
                />
              </View>

              <View style={styles.sectionDivider} />

              {/* -------- Other Expenses -------- */}

              <Text style={styles.sectionTitle}>Other Expenses</Text>

              {editItem?.otherExpenses?.map((expense: any, index: number) => (

                <View key={index} style={styles.expenseRow}>

                  <TextInput
                    style={styles.expenseName}
                    value={expense.name}
                    onChangeText={(text) => {

                      const updated = [...editItem.otherExpenses]
                      updated[index].name = text

                      setEditItem({ ...editItem, otherExpenses: updated })

                    }}
                  />

                  <TextInput
                    style={styles.expenseAmount}
                    keyboardType="numeric"
                    value={expense.amount?.toString() || ""}
                    onChangeText={(text) => {

                      const updated = [...editItem.otherExpenses]
                      updated[index].amount = Number(text)
                      setEditItem((prev: any) =>
                        recalculateCost({
                          ...prev,
                          otherExpenses: updated
                        })
                      )
                    }}
                  />

                  <Pressable
                    onPress={() => removeOtherExpense(index)}
                    style={{ padding: 6 }}
                  >
                    <Ionicons name="trash-outline" size={18} color="#ef4444" />
                  </Pressable>

                </View>

              ))}

              <Pressable
                onPress={addOtherExpense}
                style={styles.addExpenseButton}
              >
                <Ionicons name="add-circle-outline" size={18} color="#1d5bad" />
                <Text style={styles.addExpenseText}>Add Expense</Text>
              </Pressable>

              <View style={styles.sectionDivider} />

              {/* -------- Production -------- */}

              <View style={styles.editRow}>
                <Text style={styles.editLabel}>Total Meters</Text>

                <TextInput
                  style={styles.editInput}
                  keyboardType="numeric"
                  value={editItem?.totalMeters?.toString() || ""}
                  onChangeText={(text) =>
                    setEditItem({ ...editItem, totalMeters: Number(text) })
                  }
                />
              </View>

              <View style={styles.sectionDivider} />

              <Text style={styles.sectionTitle}>Cost Summary</Text>

              <View style={styles.detailRow}>
                <Text style={styles.label}>Yarn Cost</Text>
                <Text style={styles.value}>
                  ₹ {formatCurrency(editItem?.yarnCost || 0)} /m
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.label}>Production Cost</Text>
                <Text style={styles.value}>
                  ₹ {formatCurrency(editItem?.manufacturingCost || 0)} /m
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.label}>Final Cost / Meter</Text>
                <Text style={styles.value}>
                  ₹ {formatCurrency(editItem?.finalPrice || 0)}
                </Text>
              </View>

              <Text style={styles.finalPrice}>
                Final Price / Meter: ₹ {formatCurrency(editItem?.finalPrice || 0)}
              </Text>

              <Pressable
                style={styles.shareButton}
                onPress={saveEditedCalculation}
              >
                <Ionicons name="save-outline" size={18} color="white" />
                <Text style={styles.shareText}>Save Changes</Text>
              </Pressable>

            </ScrollView>

          </View>

        </View>

      </Modal>

      {/* -------- DELETE MODAL -------- */}

      <Modal visible={deleteModalVisible} transparent animationType="fade">

        <View style={styles.modalOverlay}>

          <View style={styles.modalCard}>

            <Text style={styles.modalIcon}>❗</Text>

            <Text style={styles.modalTitle}>
              Delete Calculation?
            </Text>

            <Text style={styles.modalText}>
              Are you sure you want to delete "{selectedItem?.fabricName}"?
              This action cannot be undone.
            </Text>

            <Pressable
              style={styles.deleteButton}
              onPress={deleteCalculation}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </Pressable>

            <Pressable
              style={styles.cancelButton}
              onPress={() => setDeleteModalVisible(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>

          </View>

        </View>

      </Modal>

      <Modal visible={copyModalVisible} transparent animationType="fade">

        <View style={styles.modalOverlay}>

          <View style={styles.modalCard}>

            <Text style={styles.modalIcon}>📄</Text>

            <Text style={styles.modalTitle}>
              File Copied
            </Text>

            <Text style={styles.modalText}>
              File "{copiedFileName}" copied successfully.
            </Text>

            <Pressable
              style={styles.cancelButton}
              onPress={() => setCopyModalVisible(false)}
            >
              <Text style={styles.cancelText}>OK</Text>
            </Pressable>

          </View>

        </View>

      </Modal>

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

  closeIcon: {
    position: "absolute",
    top: -12,
    right: -12,

    width: 36,
    height: 36,
    borderRadius: 18,

    backgroundColor: "white",

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: "#e5e7eb",

    elevation: 6, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },

    zIndex: 20
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 3
  },

  label: {
    flex: 1,
    fontSize: 16,
    color: "#6b7280",
  },

  value: {
    width: 140,
    textAlign: "left",
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },

  separator: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 10
  },

  input: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    fontSize: 15
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
    borderWidth: 2,
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

  sectionDivider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 16
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
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },

  modalCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 22,
    width: "100%",
    maxWidth: 360,
    alignItems: "center"
  },

  modalIcon: {
    fontSize: 28,
    marginBottom: 8
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6
  },

  modalText: {
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 20
  },

  deleteButton: {
    backgroundColor: "#ef4444",
    width: "100%",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10
  },

  deleteText: {
    color: "white",
    fontWeight: "600"
  },

  printButton: {
    flexDirection: "row",
    backgroundColor: "#c7901a",
    padding: 14,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 10
  },

  printText: {
    color: "white",
    fontWeight: "600"
  },

  cancelButton: {
    backgroundColor: "#f3f4f6",
    width: "100%",
    padding: 14,
    borderRadius: 10,
    alignItems: "center"
  },

  cancelText: {
    fontWeight: "600"
  },

  viewModalCard: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 20,
    width: "100%",
    maxHeight: "90%"
  },

  viewTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center"
  },

  viewDate: {
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 16
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 5,
    marginBottom: 8
  },

  finalPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#047857",
    marginTop: 14
  },

  shareButton: {
    flexDirection: "row",
    backgroundColor: "#152a4e",
    padding: 14,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 20
  },

  shareText: {
    color: "white",
    fontWeight: "600"
  },

  closeButton: {
    backgroundColor: "#f3f4f6",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10
  },

  editRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10
  },

  editLabel: {
    fontSize: 15,
    color: "#374151",
    flex: 1
  },

  editInput: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 10,
    width: 120,
    textAlign: "center"
  },

  editInputWide: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 10,
    flex: 1
  },

  expenseRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8
  },

  expenseName: {
    flex: 1,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 10
  },

  expenseAmount: {
    width: 90,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 10,
    textAlign: "center"
  },

  addExpenseButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#d1d5db",
    padding: 12,
    borderRadius: 10,
    marginTop: 5
  },

  addExpenseText: {
    fontWeight: "600",
    color: "#1d5bad"
  }
});