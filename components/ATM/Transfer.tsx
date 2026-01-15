import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Pressable,
  FlatList,
  Image,
} from "react-native";
import React, { useState, useMemo } from "react";
import { FONTS } from "@/constants/fonts";
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "@/api/users";
import { getProfile } from "@/api/profile";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const BASE_URL = "https://bank-app-be-eapi-btf5b.ondigitalocean.app";

interface User {
  id: string;
  username: string;
  balance?: number;
  imagePath?: string;
}

const Transfer = () => {
  const [amount, setAmount] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserList, setShowUserList] = useState(false);

  const { data: usersData } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  const { data: currentUserData } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  // Get current user ID to exclude from list
  const currentUser =
    currentUserData?.data || currentUserData?.user || currentUserData;
  const currentUserId = currentUser?.id;

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

  // Extract display name from username
  const getDisplayName = (username: string): string => {
    if (!username) return "Unknown";
    const parts = username.split("__");
    return parts[1] ?? parts[0] ?? "Unknown";
  };

  // Filter and process users
  const availableUsers = useMemo(() => {
    if (!usersData) return [];

    const usersArray = Array.isArray(usersData)
      ? usersData
      : usersData?.data || usersData?.users || [];

    if (!Array.isArray(usersArray)) return [];

    // Filter out current user, only include users with "__" in username, and filter by search query
    return usersArray
      .filter((user: User) => {
        if (user.id === currentUserId) return false;
        if (!user.username) return false;
        // Only include users with "__" in their username
        if (!user.username.includes("__")) return false;
        if (searchQuery === "") return true;
        const displayName = getDisplayName(user.username).toLowerCase();
        return displayName.includes(searchQuery.toLowerCase());
      })
      .slice(0, 10); // Limit to 10 results
  }, [usersData, currentUserId, searchQuery]);

  const inputAmount = parseAmount(amount);
  const isValidAmount = inputAmount > 0;
  const isValid = isValidAmount && selectedUser !== null;

  const handleContinue = () => {
    if (isValid) {
      // Handle continue action here
      console.log("Continue with amount:", inputAmount, "to user:", selectedUser);
    }
  };

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setShowUserList(false);
    setSearchQuery("");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Page Title */}
      <Text style={styles.pageTitle}>Transfer</Text>

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

      {/* User Selection */}
      <View style={styles.userSelectionContainer}>
        <Text style={styles.sectionLabel}>Send to</Text>

        {selectedUser ? (
          <View style={styles.selectedUserCard}>
            <Pressable
              style={styles.selectedUserInfo}
              onPress={() => setShowUserList(true)}
            >
              <View style={styles.userAvatar}>
                {selectedUser.imagePath ? (
                  <Image
                    source={{ uri: `${BASE_URL}/${selectedUser.imagePath}` }}
                    style={styles.userAvatarImage}
                  />
                ) : (
                  <Text style={styles.userAvatarText}>
                    {getDisplayName(selectedUser.username)
                      .charAt(0)
                      .toUpperCase()}
                  </Text>
                )}
              </View>
              <View style={styles.selectedUserDetails}>
                <Text style={styles.selectedUserName}>
                  {getDisplayName(selectedUser.username)}
                </Text>
                <Text style={styles.selectedUserUsername}>
                  @{selectedUser.username}
                </Text>
              </View>
            </Pressable>
            <View style={styles.selectedUserActions}>
              <Pressable
                onPress={() => {
                  setSelectedUser(null);
                  setShowUserList(false);
                  setSearchQuery("");
                }}
                style={styles.clearButton}
              >
                <MaterialCommunityIcons name="close" size={20} color="#666" />
              </Pressable>
              <Pressable onPress={() => setShowUserList(true)}>
                <MaterialCommunityIcons name="chevron-down" size={24} color="#666" />
              </Pressable>
            </View>
          </View>
        ) : (
          <Pressable
            style={styles.selectUserButton}
            onPress={() => setShowUserList(true)}
          >
            <Text style={styles.selectUserButtonText}>Select a user</Text>
            <MaterialCommunityIcons name="chevron-down" size={24} color="#666" />
          </Pressable>
        )}

        {showUserList && (
          <View style={styles.userListContainer}>
            <View style={styles.searchContainer}>
              <MaterialCommunityIcons
                name="magnify"
                size={20}
                color="#999"
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search users..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus={true}
              />
              <Pressable
                onPress={() => {
                  setShowUserList(false);
                  setSearchQuery("");
                }}
              >
                <MaterialCommunityIcons name="close" size={20} color="#999" />
              </Pressable>
            </View>

            <FlatList
              data={availableUsers}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.userItem}
                  onPress={() => handleSelectUser(item)}
                >
                  <View style={styles.userAvatar}>
                    {item.imagePath ? (
                      <Image
                        source={{ uri: `${BASE_URL}/${item.imagePath}` }}
                        style={styles.userAvatarImage}
                      />
                    ) : (
                      <Text style={styles.userAvatarText}>
                        {getDisplayName(item.username).charAt(0).toUpperCase()}
                      </Text>
                    )}
                  </View>
                  <View style={styles.userItemDetails}>
                    <Text style={styles.userItemName}>
                      {getDisplayName(item.username)}
                    </Text>
                    <Text style={styles.userItemUsername}>@{item.username}</Text>
                  </View>
                </Pressable>
              )}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No users found</Text>
                </View>
              }
              scrollEnabled={false}
            />
          </View>
        )}
      </View>

      {/* Continue Button */}
      <Pressable
        style={[
          styles.continueButton,
          !isValid && styles.continueButtonDisabled,
        ]}
        onPress={handleContinue}
        disabled={!isValid}
      >
        <Text
          style={[
            styles.continueButtonText,
            !isValid && styles.continueButtonTextDisabled,
          ]}
        >
          Continue
        </Text>
      </Pressable>
    </ScrollView>
  );
};

export default Transfer;

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
  },
  amountInput: {
    fontSize: 36,
    fontWeight: "400",
    color: "#000",
    fontFamily: FONTS.regular,
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  underline: {
    height: 2,
    backgroundColor: "#000",
    marginTop: 8,
  },
  userSelectionContainer: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 14,
    color: "#666",
    fontFamily: FONTS.regular,
    marginBottom: 12,
  },
  selectUserButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  selectUserButtonText: {
    fontSize: 16,
    color: "#666",
    fontFamily: FONTS.regular,
  },
  selectedUserCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#000",
  },
  selectedUserActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  clearButton: {
    padding: 4,
  },
  selectedUserInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    overflow: "hidden",
  },
  userAvatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  userAvatarText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    fontFamily: FONTS.semiBold,
  },
  selectedUserDetails: {
    flex: 1,
  },
  selectedUserName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    fontFamily: FONTS.semiBold,
    marginBottom: 4,
  },
  selectedUserUsername: {
    fontSize: 12,
    color: "#666",
    fontFamily: FONTS.regular,
  },
  userListContainer: {
    marginTop: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    maxHeight: 300,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#000",
    fontFamily: FONTS.regular,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  userItemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  userItemName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    fontFamily: FONTS.medium,
    marginBottom: 4,
  },
  userItemUsername: {
    fontSize: 12,
    color: "#666",
    fontFamily: FONTS.regular,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    fontFamily: FONTS.regular,
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
