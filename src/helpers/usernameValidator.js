export function usernameValidator(username) {
  if (!username) return "Không được để trống tên đăng nhập ";
  return '';
}

export function fullNameValidator(name) {
  if (!name) return "Không được để trống họ và tên";
  return '';
}
