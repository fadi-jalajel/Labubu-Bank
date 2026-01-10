import instance from ".";

const getProfile = async () => {
  const response = await instance.get("/api/auth/me");
  return response.data;
};

export { getProfile };
