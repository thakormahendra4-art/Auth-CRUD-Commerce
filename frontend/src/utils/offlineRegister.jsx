const REGISTER_KEY = "pendingRegistration";

export const savePendingRegistration = (userData) => {
  localStorage.setItem(
    REGISTER_KEY,
    JSON.stringify(userData)
  );
};

export const getPendingRegistration = () => {
  const data = localStorage.getItem(REGISTER_KEY);

  return data ? JSON.parse(data) : null;
};

export const removePendingRegistration = () => {
  localStorage.removeItem(REGISTER_KEY);
};