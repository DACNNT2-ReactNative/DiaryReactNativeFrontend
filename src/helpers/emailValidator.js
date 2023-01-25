export const emailValidator = (email) => {
    if (!email) return "Email không được để trống";
    if (email.indexOf("@") <= 0) return "Email không hợp lệ";
    if (
        email.charAt(email.length - 4) != "." &&
        email.charAt(email.length - 3) != "."
    )
        return "Email không hợp lệ";
    return "";
}