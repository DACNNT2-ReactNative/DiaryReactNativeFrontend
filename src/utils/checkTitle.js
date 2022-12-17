export const shortenTitle = (contentHtml) => {
  if (contentHtml === null) {
    return 'New Diary';
  }

  const content = contentHtml.replace(/<[^>]*>/g, '');

  const titleRemoveSpace = content.split('&nbsp;');
  let isTitleHasOnlySpace = true;
  let resultTitle;
  let shouldSkip = false;
  titleRemoveSpace.map((t) => {
    if (shouldSkip) {
      return;
    }
    if (t.trim() !== '') {
      isTitleHasOnlySpace = false;
      resultTitle = t;
      shouldSkip = true;
    }
  });

  if (!isTitleHasOnlySpace) {
    return resultTitle;
  } else {
    return 'New Diary';
  }
};
