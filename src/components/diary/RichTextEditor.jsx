import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { useRef, useState } from 'react';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';

const screen = Dimensions.get('screen');

function RichTextEditor() {
  const richText = useRef();

  const [contentHtml, setContentHtml] = useState(
    '<div>ùcuc uvigig ugigiv gvuv</div><div>uviviv hhhh<img src="https://i.pinimg.com/originals/6f/5a/34/6f5a34181beb2c2de8185d39255ad08a.jpg" style="font-size: 1em;"></div>',
  );

  const richTextHandle = (descriptionText) => {
    console.log(descriptionText);
  };

  const addImage = () => {
    richText.current.insertImage(
      'https://i.pinimg.com/originals/6f/5a/34/6f5a34181beb2c2de8185d39255ad08a.jpg',
    );
  };

  return (
    <View style={styles.richTextContainer}>
      <ScrollView>
        <RichEditor
          ref={richText}
          onChange={richTextHandle}
          placeholder="Write your cool content here :)"
          androidHardwareAccelerationDisabled={true}
          style={styles.richTextEditorStyle}
          initialHeight={screen.height - 70}
          initialContentHTML={contentHtml}
        />
      </ScrollView>
      <RichToolbar
        editor={richText}
        selectedIconTint="#dcf51d"
        iconTint="#90dc7b"
        actions={[
          actions.undo,
          actions.insertVideo,
          actions.insertImage,
          actions.setBold,
          actions.setItalic,
          actions.insertBulletsList,
          actions.setUnderline,
          actions.redo,
          actions.fontSize,
          actions.keyboard,
        ]}
        onPressAddImage={addImage}
        insertVideo={addImage}
        style={styles.richTextToolbarStyle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  richTextContainer: {
    display: 'flex',
    flexDirection: 'column-reverse',
    width: '100%',
  },

  richTextEditorStyle: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    fontSize: 20,
  },

  richTextToolbarStyle: {
    backgroundColor: '#c6c3b3',
    borderColor: '#c6c3b3',
    borderRadius: 10,
    borderWidth: 1,
    color: '#fff'
  },
});
export default RichTextEditor;
