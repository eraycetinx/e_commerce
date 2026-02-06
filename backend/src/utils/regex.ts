const emailValidation = (email: string): boolean => {
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
};

const usernameValidation = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z]([._-]?[a-zA-Z0-9]+)*$/;
  return usernameRegex.test(username);
};

const passwordValidation = (password: string): boolean => {
  const passwordRegex = /^.{8,}$/;
  return passwordRegex.test(password);
};

export { emailValidation, passwordValidation, usernameValidation };
