import instance from ".";

const getMyTransactions = async () => {
  const response = await instance.get("/api/transactions/my");
  return response.data;
};

const deposit = async (amount: number) => {
  const response = await instance.post("/api/transactions/deposit", {
    amount,
  });
  return response.data;
};

const withdraw = async (amount: number) => {
  const response = await instance.post("/api/transactions/withdraw", {
    amount,
  });
  return response.data;
};

const transfer = async (amount: number, toUserID: string) => {
  const response = await instance.post("/api/transactions/transfer", {
    amount,
    toUserID,
  });
};

export { getMyTransactions, deposit, withdraw, transfer };
