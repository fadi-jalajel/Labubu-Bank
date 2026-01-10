import instance from ".";

const getProfile = async () => {
  const response = await instance.get("/api/auth/me");
  return response.data;
};

const updateProfileImage = async (imageUri: string) => {
  const formData = new FormData();

  formData.append("image", {
    uri: imageUri,
    name: "profile.jpg",
    type: "image/jpeg",
  } as any);

  const response = await instance.put("/api/auth/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export { getProfile, updateProfileImage };
