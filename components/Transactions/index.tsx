import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  ScrollView,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { FONTS } from "@/constants/fonts";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useQuery } from "@tanstack/react-query";
import { getMyTransactions } from "@/api/transactions";
import { getProfile } from "@/api/profile";

interface Transaction {
  _id: string;
  type: "DEPOSIT" | "WITHDRAW" | "TRANSFER";
  amount: number;
  createdAt: string;
  fromUserId?: string;
  toUserId?: string;
}

const TransactionsHistory = () => {
  const [selectedFilter, setSelectedFilter] = useState<
    "ALL" | "DEPOSIT" | "WITHDRAW" | "TRANSFER"
  >("ALL");
  const [searchDate, setSearchDate] = useState("");
  const [searchAmount, setSearchAmount] = useState("");

  const { data: profileData } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const { data: transactionsData } = useQuery({
    queryKey: ["myTransactions"],
    queryFn: getMyTransactions,
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

  // Handle transactions data
  const transactionsArray: Transaction[] = Array.isArray(transactionsData)
    ? transactionsData
    : transactionsData?.data || [];

  // Filter transactions
  const filteredTransactions = transactionsArray.filter((transaction) => {
    // Filter by type
    if (selectedFilter !== "ALL" && transaction.type !== selectedFilter) {
      return false;
    }

    // Filter by date
    if (searchDate) {
      const transactionDate = new Date(
        transaction.createdAt
      ).toLocaleDateString();
      const searchDateFormatted = new Date(searchDate).toLocaleDateString();
      if (transactionDate !== searchDateFormatted) {
        return false;
      }
    }

    // Filter by amount
    if (searchAmount) {
      const searchAmountNum = parseFloat(searchAmount);
      if (isNaN(searchAmountNum) || transaction.amount !== searchAmountNum) {
        return false;
      }
    }

    return true;
  });

  const handleRefresh = () => {
    // Refresh logic here
  };

  const handleClear = () => {
    setSearchDate("");
    setSearchAmount("");
    setSelectedFilter("ALL");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount: number) => {
    return `$${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case "DEPOSIT":
        return "Deposit";
      case "WITHDRAW":
        return "Withdrawal";
      case "TRANSFER":
        return "Transfer";
      default:
        return type;
    }
  };

  const renderTransaction = ({
    item,
    index,
  }: {
    item: Transaction;
    index: number;
  }) => {
    return (
      <View>
        <View style={styles.transactionCard}>
          <View style={styles.transactionHeader}>
            <Text style={styles.transactionType}>
              {getTransactionTypeLabel(item.type)}
            </Text>
            <Text style={styles.transactionAmount}>
              {formatAmount(item.amount)}
            </Text>
          </View>
          <Text style={styles.transactionDate}>
            {formatDate(item.createdAt)}
          </Text>
        </View>
        {index < filteredTransactions.length - 1 && (
          <View style={styles.breaker} />
        )}
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
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

      {/* Search Box Area */}
      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
          <View style={styles.searchInputContainer}>
            <MaterialCommunityIcons
              name="calendar"
              size={20}
              color="#999"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by date"
              placeholderTextColor="#999"
              value={searchDate}
              onChangeText={setSearchDate}
            />
          </View>
          <View style={styles.searchInputContainer}>
            <MaterialCommunityIcons
              name="currency-usd"
              size={20}
              color="#999"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by amount"
              placeholderTextColor="#999"
              value={searchAmount}
              onChangeText={setSearchAmount}
              keyboardType="numeric"
            />
          </View>
        </View>
        <Pressable style={styles.clearButton} onPress={handleClear}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </Pressable>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <Pressable
          style={[
            styles.filterButton,
            selectedFilter === "ALL" && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedFilter("ALL")}
        >
          <Text
            style={[
              styles.filterButtonText,
              selectedFilter === "ALL" && styles.filterButtonTextActive,
            ]}
          >
            All
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.filterButton,
            selectedFilter === "DEPOSIT" && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedFilter("DEPOSIT")}
        >
          <Text
            style={[
              styles.filterButtonText,
              selectedFilter === "DEPOSIT" && styles.filterButtonTextActive,
            ]}
          >
            Deposits
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.filterButton,
            selectedFilter === "WITHDRAW" && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedFilter("WITHDRAW")}
        >
          <Text
            style={[
              styles.filterButtonText,
              selectedFilter === "WITHDRAW" && styles.filterButtonTextActive,
            ]}
          >
            Withdrawals
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.filterButton,
            selectedFilter === "TRANSFER" && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedFilter("TRANSFER")}
        >
          <Text
            style={[
              styles.filterButtonText,
              selectedFilter === "TRANSFER" && styles.filterButtonTextActive,
            ]}
          >
            Transfers
          </Text>
        </Pressable>
      </View>

      {/* Transactions List */}
      <View style={styles.transactionsContainer}>
        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item._id}
          renderItem={renderTransaction}
          scrollEnabled={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No transactions found</Text>
            </View>
          }
        />
      </View>
    </ScrollView>
  );
};

export default TransactionsHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 20,
    // paddingBottom: 100,
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
  // Search Container Styles
  searchContainer: {
    marginBottom: 20,
  },
  searchRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 14,
    color: "#000",
    fontFamily: FONTS.regular,
  },
  clearButton: {
    alignSelf: "flex-end",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  clearButtonText: {
    fontSize: 14,
    color: "#666",
    fontFamily: FONTS.semiBold,
  },
  // Filter Buttons Styles
  filterContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 50,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  filterButtonActive: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  filterButtonText: {
    fontSize: 10,
    color: "#666",
    fontFamily: FONTS.semiBold,
  },
  filterButtonTextActive: {
    color: "#fff",
  },
  // Transactions Container
  transactionsContainer: {
    marginBottom: 32,
  },
  transactionCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    fontFamily: FONTS.semiBold,
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    fontFamily: FONTS.bold,
  },
  transactionDate: {
    fontSize: 13,
    color: "#666",
    fontFamily: FONTS.regular,
  },
  breaker: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 8,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    fontFamily: FONTS.regular,
  },
});
