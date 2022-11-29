export const loginStorage = (
  username: string,
  token: string,
  isUser: string
) => {
  localStorage.setItem("username", username);
  localStorage.setItem("token", token);
  localStorage.setItem("id_user", isUser);
};

export const logoutStorage = () => {
  localStorage.setItem("username", "");
  localStorage.setItem("token", "");
  localStorage.clear();
};
