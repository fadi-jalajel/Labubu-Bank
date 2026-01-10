import instance from ".";

const getAllUsers = async () => {
  const response = await instance.get("/api/users");
  return response.data;
};

const getUser = async (userId: string) => {
  const response = await instance.get(`/api/users/${userId}`);
  return response.data;
};

export { getAllUsers, getUser };
