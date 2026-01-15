import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import React from "react";
import { FONTS } from "@/constants/fonts";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/api/profile";
import { Link } from "expo-router";

// Page title - change this text to update the title
const PAGE_TITLE = "ATM";

const ATM = () => {
  const { data: profileData } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  // Get net worth from profile
  const netWorth = profileData?.data?.balance || profileData?.balance || 0;
  const lastUpdated = new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const formatAmount = (amount: number) => {
    return `$${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const handleRefresh = () => {
    // Refresh logic here - you can use queryClient.invalidateQueries if needed
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Page Title */}
      <Text style={styles.pageTitle}>{PAGE_TITLE}</Text>

      {/* Credit Card */}
      <View style={styles.cardContainer}>
        <LinearGradient
          colors={["#FFB6C1", "#98FB98", "#FFFFFF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.creditCard}
        >
          <Text style={styles.cardTitle}>Your Labubu's Networth</Text>
          <Text style={styles.cardAmount}>{formatAmount(netWorth)}</Text>
        </LinearGradient>
      </View>

      {/* Last Updated with Refresh */}
      <View style={styles.lastUpdatedContainer}>
        <Text style={styles.lastUpdatedText}>as of {lastUpdated}</Text>
        <Pressable style={styles.refreshButton} onPress={handleRefresh}>
          <MaterialCommunityIcons name="refresh" size={18} color="#666" />
        </Pressable>
      </View>

      {/* ATM Options */}
      <View style={styles.optionsContainer}>
        <Link href="/(protected)/deposit" asChild>
          <Pressable style={styles.optionCard}>
            <View style={styles.optionIconContainer}>
              <MaterialCommunityIcons
                name="arrow-down-circle"
                size={32}
                color="#2ECC71"
              />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Deposit</Text>
              <Text style={styles.optionSubtitle}>
                Add money to your account
              </Text>
            </View>
          </Pressable>
        </Link>

        <Link href="/(protected)/withdraw" asChild>
          <Pressable style={styles.optionCard}>
            <View style={styles.optionIconContainer}>
              <MaterialCommunityIcons
                name="arrow-up-circle"
                size={32}
                color="#E74C3C"
              />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Withdraw</Text>
              <Text style={styles.optionSubtitle}>
                Take money from your account
              </Text>
            </View>
          </Pressable>
        </Link>

        <Link href="/(protected)/transfer" asChild>
          <Pressable style={styles.optionCard}>
            <View style={styles.optionIconContainer}>
              <MaterialCommunityIcons
                name="transfer"
                size={32}
                color="#3498DB"
              />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Transfer Money</Text>
              <Text style={styles.optionSubtitle}>
                Send money to another account
              </Text>
            </View>
          </Pressable>
        </Link>
      </View>
    </ScrollView>
  );
};

export default ATM;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 20,
    marginTop: 20,
  },
  pageTitle: {
    fontSize: 36,
    fontWeight: "700",
    color: "#000",
    fontFamily: FONTS.bold,
    marginBottom: 24,
    paddingTop: 20,
  },
  // Credit Card Styles
  cardContainer: {
    marginBottom: 16,
  },
  creditCard: {
    width: "100%",
    height: 200,
    borderRadius: 20,
    padding: 24,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 16,
    color: "#333",
    fontFamily: FONTS.medium,
    marginBottom: 8,
  },
  cardAmount: {
    fontSize: 42,
    fontWeight: "700",
    color: "#000",
    fontFamily: FONTS.bold,
  },
  // Last Updated Styles
  lastUpdatedContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    gap: 8,
  },
  lastUpdatedText: {
    fontSize: 12,
    color: "#666",
    fontFamily: FONTS.regular,
  },
  refreshButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  // ATM Options Styles
  optionsContainer: {
    marginTop: 32,
    gap: 16,
  },
  optionCard: {
    backgroundColor: "#f8f8f8",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    fontFamily: FONTS.semiBold,
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    color: "#666",
    fontFamily: FONTS.regular,
  },
});
