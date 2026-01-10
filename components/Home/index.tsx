import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  Pressable,
} from "react-native";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { getAllUsers } from "@/api/users";
import { getProfile } from "@/api/profile";

const { height } = Dimensions.get("window");
const HERO_HEIGHT = height * 0.65;
const IMAGE_RATIO = 4 / 5;

const BASE_URL = "https://bank-app-be-eapi-btf5b.ondigitalocean.app";

function decodeUsername(username: string) {
  const parts = username.split("__");
  return {
    displayName: parts[1] ?? parts[0],
  };
}

export default function HomeScreen() {
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  const { data: theLabubuUser } = useQuery({
    queryKey: ["theLabubuUser"],
    queryFn: getProfile,
  });

  const { leaderboard, myRank } = useMemo(() => {
    if (!users || !theLabubuUser) return { leaderboard: [], myRank: null };

    const sorted = [...users].sort((a, b) => {
      if (b.balance !== a.balance) return b.balance - a.balance;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

    const rank = sorted.findIndex((u) => u.id === theLabubuUser.id) + 1 || null;

    return {
      leaderboard: sorted.slice(0, 10),
      myRank: rank,
    };
  }, [users, theLabubuUser]);

  if (!theLabubuUser) return null;

  const { displayName } = decodeUsername(theLabubuUser.username);
  const myImage = `${BASE_URL}/${theLabubuUser.imagePath}`;

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

      {/* HERO SECTION */}
      <View style={styles.hero}>
        {myRank && (
          <Text style={styles.rankWatermark}>
            {String(myRank).padStart(2, "0")}
          </Text>
        )}

        <Image source={{ uri: myImage }} style={styles.labubuImage} />

        <View style={styles.infoBox}>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.balance}>
            ${theLabubuUser.balance.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* LEADERBOARD */}
      <FlatList
        data={leaderboard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          const { displayName } = decodeUsername(item.username);
          return (
            <View style={styles.row}>
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
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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

  rankWatermark: {
    position: "absolute",
    fontSize: 180,
    fontWeight: "900",
    color: "rgba(0,0,0,0.05)",
    top: "18%",
  },

  labubuImage: {
    width: HERO_HEIGHT * IMAGE_RATIO * 0.8,
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
  },

  balance: {
    fontSize: 18,
    color: "#666",
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
  },

  rowBalance: {
    fontWeight: "600",
  },
});
