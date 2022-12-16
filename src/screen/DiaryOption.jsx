import React from 'react';
import { useState } from 'react';
import { Dimensions, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Dialog, Divider, List, Portal } from 'react-native-paper';
import RenderHTML from 'react-native-render-html';
import { SharedElement } from 'react-navigation-shared-element';

const screen = Dimensions.get('screen');

const DiaryOption = ({ route, navigation }) => {
  const { diary } = route.params;
  const { width } = useWindowDimensions();
  const [contentVisible, setContentVisible] = useState(true);
  const [actionVisible, setActionVisible] = useState(true);
  console.log(diary);

  const WebDisplay = React.memo(function WebDisplay({ content }) {
    const tagsStyles = {
      body: {
        whiteSpace: 'normal',
        color: 'gray',
      },
      div: {
        fontSize: '12px',
      },
    };
    return (
      <RenderHTML
        enableExperimentalBRCollapsing={true}
        contentWidth={width}
        source={{ html: content }}
        tagsStyles={tagsStyles}
      />
    );
  });

  return (
    <View style={styles.container}>
      <Dialog
        style={styles.dialog}
        visible={contentVisible}
        onDismiss={() => {
          setActionVisible(false);
          navigation.goBack();
        }}
      >
        {contentVisible && (
          <SharedElement id={diary.diaryId}>
            <View style={styles.diary}>
              <WebDisplay content={diary.content ? diary.content : source.html} />
            </View>
          </SharedElement>
        )}
        {actionVisible && (
          <View style={styles.actions}>
            <List.Item
              title="Chỉnh sửa"
              right={(props) => <List.Icon {...props} icon="clipboard-edit-outline" />}
              onPress={() => {
                setContentVisible(false);
                navigation.replace('DiaryEdit', { diary: diary });
              }}
            />
            <Divider />
            <List.Item
              title="Xóa"
              right={(props) => <List.Icon {...props} icon="delete" />}
              onPress={() => console.log('press')}
            />
            <Divider />
          </View>
        )}
      </Dialog>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
  dialog: {
    backgroundColor: 'transparent',
    height: screen.width,
    width: screen.width,
    marginTop: -150,
    marginLeft: 0,
    alignItems: 'center',
  },
  diary: {
    height: screen.width - 50,
    width: screen.width - 50,
    backgroundColor: '#fbead1',
    borderRadius: 12,
    padding: 20,
  },
  actions: {
    width: screen.width / 2,
    backgroundColor: '#fbead1',
    marginTop: 20,
    borderRadius: 10,
  },
});

export default DiaryOption;
