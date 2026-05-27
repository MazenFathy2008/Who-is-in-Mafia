const checkEmail = (email)=>{
  const emailFormat = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailFormat.test(email)
}
const checkPassword = (password)=>{
  const passwordFormat = /[^A-Za-z0-9]/;
  const passwordLength = password?password.length:0;
  return passwordLength >=8 && passwordFormat.test(password)
}
const checkUserName = (userName)=>{
  const userNameFormat = /^[A-Za-z0-9_]{3,20}$/
  return userNameFormat.test(userName)
}
export {checkEmail,checkUserName,checkPassword}