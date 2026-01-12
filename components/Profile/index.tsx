// import { getProfile } from "@/api/profile";
// import MaterialIcons from "@expo/vector-icons/MaterialIcons";
// import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
// import { useState } from "react";
// import { router } from "expo-router";
// import { deleteItemAsync } from "expo-secure-store";
// import React from "react";
// import { Image, StyleSheet, Text, View, Pressable, Alert } from "react-native";
// import Spinner from "../Loading/Spinner";
// import { FONTS } from "@/constants/fonts";
// import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
// import * as ImagePicker from "expo-image-picker";
// import { updateProfileImage } from "@/api/profile";

// const BASE_URL = "https://bank-app-be-eapi-btf5b.ondigitalocean.app";

// function extractUserName(username: string) {
//   if (!username) return { displayName: "Unknown" };
//   const parts = username.split("__");
//   return parts;
// }

// // function extractDisplayName(username: string | undefined) {
// //   if (!username) return { displayName: "Unknown" };
// //   const parts = username.split("__");
// //   return {
// //     displayNamePart: parts[1] ?? parts[0],
// //   };
// // }

// const Profile = () => {
//   const queryClient = useQueryClient();

//   /////////////////////////////////////////////////////////
//   //Tracking Loading Status for image picking
//   const [isLoading, setIsLoading] = useState(false);

//   const requestPermission = async () => {
//     const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (!granted) {
//       Alert.alert(
//         "Permission required",
//         "We need access to your photos so you can pick an image."
//       );
//       return false;
//     }
//     return true;
//   };

//   const handlePickImage = async () => {
//     const hasPermission = await requestPermission();

//     if (!hasPermission) {
//       return;
//     }

//     try {
//       setIsLoading(true);

//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ["images", "videos"],
//         // allowsEditing: true,
//         // aspect: [4, 5],
//         quality: 0.5,
//       });

//       if (!result.canceled && result.assets && result.assets.length > 0) {
//         const pickedAsset = result.assets[0];
//         mutate(pickedAsset.uri);
//       }
//     } catch (error) {
//       console.log("Error picking image:", error);
//       Alert.alert("Something went wrong", "Could not pick the image.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const { mutate } = useMutation({
//     mutationKey: ["updateImage"],
//     mutationFn: updateProfileImage,
//     // onSuccess: (data) => {},
//     onError: (error) => {
//       console.log("🚀 ~ SignupScreen ~ error:", error);
//     },
//   });

//   /////////////////////////<><><><><><>///////////////////

//   const { data, isLoading: isProfileLoading } = useQuery({
//     queryKey: ["profile"],
//     queryFn: getProfile,
//   });

//   const logout = async () => {
//     await deleteItemAsync("token");
//     router.dismissTo("/(auth)/signin");
//   };

//   if (isProfileLoading) return <Spinner size="large" color={"#000"} />;

//   // Handle nested profile response
//   const currentUser = data?.data || data?.user;

//   if (!currentUser) return null;

//   const userNameParts = extractUserName(currentUser.username);
//   const userNamePart = Array.isArray(userNameParts)
//     ? userNameParts[0]
//     : "Unknown";
//   const displayNamePart = Array.isArray(userNameParts)
//     ? (userNameParts[1] ?? userNameParts[0])
//     : "Unknown";
//   // const { displayNamePart } = extractDisplayName(currentUser.username);

//   const myImage = `${BASE_URL}/${currentUser.imagePath}`;
//   const myBalance = data?.data.balance;

//   return (
//     <View style={styles.container}>
//       {/* HEADER */}
//       <View style={styles.header}>
//         <Text style={styles.subtitle}>Your Labubu Account</Text>
//       </View>

//       {/* PROFILE CONTENT */}
//       <View style={styles.content}>
//         {/* PROFILE CARD */}
//         <View style={styles.card}>
//           <Image source={{ uri: myImage }} style={styles.profileImage} />
//           <Pressable style={styles.cameraButton} onPress={handlePickImage}>
//             <MaterialCommunityIcons name="camera" size={24} color="black" />
//           </Pressable>
//         </View>

//         {/* USER INFO */}
//         <View style={styles.userInfo}>
//           <Text style={styles.userName}>Hi, {displayNamePart}</Text>
//           <Text style={styles.userNamePart}>@{userNamePart}</Text>
//           <Text style={styles.quoteText}>
//             You are worth ${myBalance?.toLocaleString()}
//           </Text>
//         </View>
//       </View>

//       {/* LOGOUT BUTTON */}
//       <View style={styles.footer}>
//         <Pressable style={styles.logoutButton} onPress={logout}>
//           <MaterialIcons name="logout" size={20} color="#fff" />
//           <Text style={styles.logoutText}>Sign Out</Text>
//         </Pressable>
//       </View>
//     </View>
//   );
// };

// export default Profile;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     paddingHorizontal: 20,
//   },

//   /* HEADER */
//   header: {
//     paddingTop: 48,
//     paddingBottom: 24,
//   },

//   subtitle: {
//     fontSize: 14,
//     color: "#888",
//     letterSpacing: 0.5,
//     textAlign: "center",
//     fontFamily: FONTS.regular,
//   },

//   /* CONTENT */
//   content: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   /* CARD */
//   card: {
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 32,
//   },

//   profileImage: {
//     width: 160,
//     height: 200,
//     borderRadius: 24,
//     resizeMode: "cover",
//     backgroundColor: "#f2f2f2",
//   },

//   /* USER INFO */
//   userInfo: {
//     alignItems: "center",
//     width: "100%",
//   },

//   userName: {
//     fontSize: 26,
//     fontWeight: "700",
//     fontFamily: FONTS.bold,
//     marginBottom: 6,
//     color: "#111",
//     textAlign: "center",
//   },
//   cameraButton: {
//     position: "absolute",
//     bottom: 0,
//     right: 0,
//     width: 40,
//     height: 40,
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 2,
//     borderColor: "#e0e0e0",
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 3,
//   },

//   userNamePart: {
//     fontSize: 22,
//     fontWeight: "600",
//     fontFamily: FONTS.semiBold,
//     marginBottom: 12,
//     color: "#333",
//     textAlign: "center",
//   },

//   quoteText: {
//     fontSize: 16,
//     color: "#555",
//     textAlign: "center",
//     paddingHorizontal: 24,
//     lineHeight: 22,
//     fontStyle: "italic",
//     marginTop: 8,
//     fontFamily: FONTS.regular,
//   },

//   /* FOOTER */
//   footer: {
//     paddingBottom: 32,
//     paddingTop: 24,
//   },

//   logoutButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#000",
//     paddingVertical: 14,
//     paddingHorizontal: 24,
//     borderRadius: 12,
//     gap: 8,
//   },

//   logoutText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//     fontFamily: FONTS.semiBold,
//   },
// });

import { StyleSheet, Text, View } from "react-native";
import React from "react";

const Profile = () => {
  return (
    <View>
      <Text>Profile</Text>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({});
