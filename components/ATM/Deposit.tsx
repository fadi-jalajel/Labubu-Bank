import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { FONTS } from "@/constants/fonts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deposit } from "@/api/transactions";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/api/profile";
import { useRouter } from "expo-router";

const Deposit = () => {
  const [amount, setAmount] = useState("");
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: profileData } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  // Get balance from profile
  const balance = profileData?.data?.balance || profileData?.balance || 0;

  // Format amount with dollar sign and commas
  const formatAmount = (amount: number) => {
    return `$${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Format number with commas for display
  const formatNumberWithCommas = (value: string): string => {
    if (value === "") return "";

    // Remove all non-numeric characters except decimal point
    let cleaned = value.replace(/[^0-9.]/g, "");

    // Handle multiple decimal points - keep only the first one
    const parts = cleaned.split(".");
    if (parts.length > 2) {
      cleaned = parts[0] + "." + parts.slice(1).join("");
    }

    // Split into integer and decimal parts
    const [integerPart, decimalPart] = cleaned.split(".");

    // Format integer part with commas
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Combine with decimal part if it exists
    if (decimalPart !== undefined) {
      // Limit to 2 decimal places
      const limitedDecimal = decimalPart.substring(0, 2);
      return formattedInteger + (limitedDecimal ? "." + limitedDecimal : "");
    }

    return formattedInteger;
  };

  // Parse input amount to number (removes commas)
  const parseAmount = (input: string): number => {
    if (input === "") return 0;
    // Remove all non-numeric characters except decimal point (this removes commas too)
    const cleaned = input.replace(/[^0-9.]/g, "");
    // Handle multiple decimal points - keep only the first one
    const parts = cleaned.split(".");
    if (parts.length > 2) {
      return parseFloat(parts[0] + "." + parts.slice(1).join(""));
    }
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

  const handleAmountChange = (text: string) => {
    // Allow empty input
    if (text === "") {
      setAmount("");
      return;
    }

    // Remove all non-numeric characters except decimal point (removes commas)
    let cleaned = text.replace(/[^0-9.]/g, "");

    // Handle multiple decimal points - keep only the first one
    const parts = cleaned.split(".");
    if (parts.length > 2) {
      cleaned = parts[0] + "." + parts.slice(1).join("");
    }

    // Limit to 2 decimal places
    if (parts.length === 2 && parts[1].length > 2) {
      cleaned = parts[0] + "." + parts[1].substring(0, 2);
    }

    // Format with commas for display
    const formatted = formatNumberWithCommas(cleaned);
    setAmount(formatted);
  };

  const inputAmount = parseAmount(amount);
  const isValidAmount = inputAmount > 0;

  const { mutate, isPending } = useMutation({
    mutationKey: ["deposit"],
    mutationFn: deposit,
    onSuccess: (data) => {
      console.log("🚀 ~ Deposit ~ data:", "succesful deposit");
      // Invalidate profile query to refresh balance
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      // Navigate to success screen with transaction data
      router.push({
        pathname: "/(protected)/deposit-success",
        params: {
          amount: inputAmount.toString(),
          transactionId: data?.data?.id || data?.id || "",
        },
      });
    },
    onError: (error) => {
      console.log("🚀 ~ Deposit ~ error:", error);
    },
  });

  const handleContinue = () => {
    if (isValidAmount) {
      // Handle continue action here
      console.log("Continue with amount:", inputAmount);
      mutate(inputAmount);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Page Title */}
      <Text style={styles.pageTitle}>Deposit</Text>

      {/* Amount Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.amountInput}
          placeholder="0.00"
          placeholderTextColor="#999"
          value={amount}
          onChangeText={handleAmountChange}
          keyboardType="decimal-pad"
          autoFocus={false}
        />
        <View style={styles.underline} />
      </View>

      {/* Total Balance */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceAmount}>{formatAmount(balance)}</Text>
      </View>

      {/* Continue Button */}
      <Pressable
        style={[
          styles.continueButton,
          !isValidAmount && styles.continueButtonDisabled,
        ]}
        onPress={handleContinue}
        disabled={!isValidAmount}
      >
        <Text
          style={[
            styles.continueButtonText,
            !isValidAmount && styles.continueButtonTextDisabled,
          ]}
        >
          Continue
        </Text>
      </Pressable>
    </ScrollView>
  );
};

export default Deposit;

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
    marginBottom: 40,
    paddingTop: 20,
  },
  inputContainer: {
    marginBottom: 32,
    position: "relative",
  },
  amountInput: {
    fontSize: 36,
    fontWeight: "400",
    color: "#000",
    fontFamily: FONTS.regular,
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  amountInputDisabled: {
    opacity: 0.5,
    color: "#999",
  },
  underline: {
    height: 2,
    backgroundColor: "#000",
    marginTop: 8,
  },
  loadingOverlay: {
    position: "absolute",
    right: 0,
    top: 12,
    padding: 4,
  },
  balanceContainer: {
    marginTop: 24,
  },
  balanceLabel: {
    fontSize: 14,
    color: "#666",
    fontFamily: FONTS.regular,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
    fontFamily: FONTS.semiBold,
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
  continueButtonDisabled: {
    backgroundColor: "#e0e0e0",
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    fontFamily: FONTS.semiBold,
  },
  continueButtonTextDisabled: {
    color: "#999",
  },
});
