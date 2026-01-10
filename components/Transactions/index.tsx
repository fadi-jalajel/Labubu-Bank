import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getMyTransactions } from "@/api/transactions";
import Spinner from "@/components/Loading/Spinner";

interface Transaction {
  id: string;
  type: "DEPOSIT" | "WITHDRAW" | "TRANSFER";
  amount: number;
  createdAt: string;
  toUserID?: string;
  fromUserID?: string;
}

const TransactionHistory = () => {
  const {
    data: transactions,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["myTransactions"],
    queryFn: getMyTransactions,
  });

  // Handle nested response structure
  const transactionsArray: Transaction[] = Array.isArray(transactions)
    ? transactions
    : transactions?.data || transactions?.transactions || [];

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

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "DEPOSIT":
        return "#22c55e"; // green
      case "WITHDRAW":
      case "TRANSFER":
        return "#ef4444"; // red
      default:
        return "#000";
    }
  };

  const renderTransaction = ({ item }: { item: Transaction }) => {
    const color = getTransactionColor(item.type);
    const typeLabel = getTransactionTypeLabel(item.type);

    return (
      <View style={styles.transactionItem}>
        <View style={styles.transactionLeft}>
          <Text style={styles.transactionType}>{typeLabel}</Text>
          <Text style={styles.transactionDate}>
            {formatDate(item.createdAt)}
          </Text>
        </View>
        <Text style={[styles.transactionAmount, { color }]}>
          {item.type === "DEPOSIT" ? "+" : "-"}
          {formatAmount(item.amount)}
        </Text>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No transactions yet</Text>
      <Text style={styles.emptySubtext}>
        Your transaction history will appear here
      </Text>
    </View>
  );

  if (isLoading) {
    return <Spinner size="large" color="#000" />;
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load transactions</Text>
        <Text style={styles.errorSubtext}>Please try again later</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={transactionsArray}
        keyExtractor={(item) =>
          item.id || `transaction-${item.createdAt}-${item.amount}`
        }
        renderItem={renderTransaction}
        contentContainerStyle={
          transactionsArray.length === 0
            ? styles.emptyListContainer
            : styles.listContainer
        }
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#000"
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default TransactionHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  emptyListContainer: {
    flex: 1,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  transactionLeft: {
    flex: 1,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#000",
  },
  transactionDate: {
    fontSize: 14,
    color: "#666",
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: "700",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ef4444",
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});
