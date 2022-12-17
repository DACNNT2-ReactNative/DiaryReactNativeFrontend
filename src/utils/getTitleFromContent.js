export const getTitleFromContent = (contentHtml) => {
  if (contentHtml === null) {
    return 'New Diary';
  }
  
  let title;
  let resultTitle;

  const splitContent = contentHtml.split('</div>');
  console.log('split',splitContent);
  const titleResult = splitContent[0].split('<div');
  let finalResult;
  if (titleResult[1]) {
    finalResult = titleResult[1].split('>');
  } else {
    finalResult = titleResult[0];
  }
  if (finalResult[1]) {
    title = finalResult[1];
  } else {
    title = finalResult[0];
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
