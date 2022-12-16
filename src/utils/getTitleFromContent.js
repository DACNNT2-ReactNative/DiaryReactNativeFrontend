export const getTitleFromContent = (contentHtml) => {
  let title;
  let resultTitle;

  const splitContent = contentHtml.split('</div>');
  const titleResult = splitContent[0].split('<div>');
  if (titleResult[1]) {
    title = titleResult[1];
  } else {
    title = titleResult[0];
  }

  if (title && title !== '<br>') {
    const titleSpace = title.split('&nbsp;');
    let isTitleHasOnlySpace = true;
    titleSpace.map((t) => {
      if (t.trim() !== '') {
        isTitleHasOnlySpace = false;
      }
    });
    if (!isTitleHasOnlySpace) {
      resultTitle = title;
    } else {
      resultTitle = 'New Diary';
    }
  } else {
    resultTitle = 'New Diary';
  }

  return resultTitle;
};
