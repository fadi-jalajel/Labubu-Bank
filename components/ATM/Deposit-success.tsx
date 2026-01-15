import { StyleSheet, Text, View, ScrollView, Pressable } from "react-native";
import React from "react";
import { FONTS } from "@/constants/fonts";
import { useRouter, useLocalSearchParams } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const DepositSuccess = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const amount = parseFloat(params.amount as string) || 0;

  const formatAmount = (amount: number) => {
    return `$${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const handleContinueToATM = () => {
    router.push("/(protected)/(tabs)/atm");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Success Icon */}
      <View style={styles.iconContainer}>
        <View style={styles.successIcon}>
          <MaterialCommunityIcons name="check" size={48} color="#2ECC71" />
        </View>
      </View>

      {/* Success Title */}
      <Text style={styles.successTitle}>Deposit Successful!</Text>

      {/* Transaction Summary */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Amount Deposited</Text>
          <Text style={styles.summaryValue}>{formatAmount(amount)}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Transaction Type</Text>
          <Text style={styles.summaryValue}>Deposit</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Status</Text>
          <Text style={[styles.summaryValue, styles.successStatus]}>
            Completed
          </Text>
        </View>
      </View>

      {/* Continue Button */}
      <Pressable style={styles.continueButton} onPress={handleContinueToATM}>
        <Text style={styles.continueButtonText}>Continue to ATM</Text>
      </Pressable>
    </ScrollView>
  );
};

export default DepositSuccess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 20,
    marginTop: 20,
  },
  iconContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 24,
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E8F8F5",
    alignItems: "center",
    justifyContent: "center",
  },
  successTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
    fontFamily: FONTS.bold,
    textAlign: "center",
    marginBottom: 40,
  },
  summaryContainer: {
    backgroundColor: "#f8f8f8",
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#666",
    fontFamily: FONTS.regular,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    fontFamily: FONTS.semiBold,
  },
  successStatus: {
    color: "#2ECC71",
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 4,
  },
  continueButton: {
    marginTop: 40,
    backgroundColor: "#000",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    fontFamily: FONTS.semiBold,
  },
});
