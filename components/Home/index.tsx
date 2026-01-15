import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  Pressable,
} from "react-native";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { getAllUsers } from "@/api/users";
import { getProfile } from "@/api/profile";
import Spinner from "@/components/Loading/Spinner";
import { FONTS } from "@/constants/fonts";

const { height } = Dimensions.get("window");
const HERO_HEIGHT = height * 0.65;
const IMAGE_RATIO = 4 / 5;

const BASE_URL = "https://bank-app-be-eapi-btf5b.ondigitalocean.app";

function decodeUsername(username: string | undefined) {
  if (!username) return { displayName: "Unknown" };
  const parts = username.split("__");
  return {
    displayName: parts[1] ?? parts[0],
  };
}

export default function HomeScreen() {
  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  const { data: theLabubuUser, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["theLabubuUser"],
    queryFn: getProfile,
  });

  //useMemo remembers the result of a calculation so React doesn't redo it on every render unless something important changes.

  const { leaderboard, myRank } = useMemo(() => {
    if (!users || !theLabubuUser) return { leaderboard: [], myRank: null };

    // Handle nested response structure - users might be in data.data or data.users
    const usersArray = Array.isArray(users)
      ? users
      : users?.data || users?.users || [];

    // Ensure it's an array before spreading
    if (!Array.isArray(usersArray)) {
      console.error("❌ Users is not an array:", users);
      return { leaderboard: [], myRank: null };
    }

    // Filter to only include users with "__" in username (project accounts)
    const filteredUsers = usersArray.filter(
      (user) => user.username && user.username.includes("__")
    );

    // Handle nested profile response - user might be in data.data or data.user
    const currentUser =
      theLabubuUser?.data || theLabubuUser?.user || theLabubuUser;
    const currentUserId = currentUser?.id;

    const sorted = [...filteredUsers].sort((a, b) => {
      if (b.balance !== a.balance) return b.balance - a.balance;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

    const rank = currentUserId
      ? sorted.findIndex((u) => u.id === currentUserId) + 1
      : null;

    return {
      leaderboard: sorted.slice(0, 10),
      myRank: rank,
    };
  }, [users, theLabubuUser]);

  // Show loading spinner while data is being fetched
  if (isLoadingUsers || isLoadingProfile) {
    return <Spinner size="large" color="#000" />;
  }

  // Handle nested profile response
  const currentUser =
    theLabubuUser?.data || theLabubuUser?.user || theLabubuUser;

  if (!currentUser) return null;

  const { displayName } = decodeUsername(currentUser.username);
  const myImage = `${BASE_URL}/${currentUser.imagePath}`;

  return (
    <View style={styles.container}>
      {/* HEADER (Profile Icon) */}
      <View style={styles.header}>
        <Link href="/profile" asChild>
          <Pressable hitSlop={10}>
            <MaterialCommunityIcons
              name="account-circle-outline"
              size={28}
              color="black"
            />
          </Pressable>
        </Link>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO SECTION */}
        <View style={styles.hero}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: myImage }} style={styles.labubuImage} />
            {myRank && (
              <View style={styles.rankContainer}>
                <MaterialCommunityIcons
                  name="crown-outline"
                  size={100}
                  color="black"
                />
                <Text style={styles.rankMark}>
                  {String(myRank).padStart(2, "0")}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.name}>{displayName}</Text>
            <Text style={styles.balance}>
              ${currentUser.balance.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* LEADERBOARD */}
        <View style={styles.list}>
          {leaderboard.map((item, index) => {
            const { displayName } = decodeUsername(item.username);
            return (
              <View key={item.id} style={styles.row}>
                <Text style={styles.rowRank}>
                  {String(index + 1).padStart(2, "0")}
                </Text>

                <Image
                  source={{ uri: `${BASE_URL}/${item.imagePath}` }}
                  style={styles.rowImage}
                />

                <Text style={styles.rowName}>{displayName}</Text>

                <Text style={styles.rowBalance}>
                  ${item.balance.toLocaleString()}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
  },

  /* HEADER */
  header: {
    position: "absolute",
    top: 48,
    right: 20,
    zIndex: 10,
  },

  /* HERO */
  hero: {
    height: HERO_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },

  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },

  rankContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  rankLabel: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: FONTS.extraBold,
    color: "grey",
    marginTop: -22,
    textAlign: "right",
  },

  rankMark: {
    fontSize: 80,
    fontWeight: "900",
    fontFamily: FONTS.extraBold,
    color: "black",
  },

  labubuImage: {
    width: HERO_HEIGHT * IMAGE_RATIO * 0.5,
    height: HERO_HEIGHT * 0.8,
    resizeMode: "contain",
  },

  infoBox: {
    position: "absolute",
    bottom: 24,
    right: 24,
    alignItems: "flex-end",
  },

  name: {
    fontSize: 22,
    fontWeight: "700",
    fontFamily: FONTS.bold,
  },

  balance: {
    fontSize: 18,
    color: "#666",
    fontFamily: FONTS.regular,
  },

  /* LEADERBOARD */
  list: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  rowRank: {
    width: 32,
    fontWeight: "700",
    fontFamily: FONTS.bold,
    color: "#999",
  },

  rowImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },

  rowName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    fontFamily: FONTS.medium,
  },

  rowBalance: {
    fontWeight: "600",
    fontFamily: FONTS.semiBold,
  },
});
