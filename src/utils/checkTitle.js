export const shortenTitle = (title) => {
  if (title.length > 12) {
    return title.slice(0, 12) + '...';
  } else {
    return title;
  }
};
