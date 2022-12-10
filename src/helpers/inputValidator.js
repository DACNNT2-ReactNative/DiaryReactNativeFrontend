export function topicNameValidator(name) {
    if (!name) return "Không được để trống tên chủ đề";
    if (name.length > 20) return 'Tên chủ đề quá dài';
    return '';
  }