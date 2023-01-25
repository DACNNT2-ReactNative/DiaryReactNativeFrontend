import { useIsFocused } from '@react-navigation/native';
import React, { useEffect } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { List, Paragraph } from 'react-native-paper';
import RenderHTML from 'react-native-render-html';
import { SharedElement } from 'react-navigation-shared-element';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { diaryStatus } from '../../constants/diaryStatus';
import { useDecodeToken } from '../../hooks/useDecodeToken';
import { diarySelectors } from '../../redux/diary/selector';
import { actions as diaryActions } from '../../redux/diary/slice';
import axiosConfig from '../../utils/axios';
import { shortenTitle } from '../../utils/checkTitle';
import { getFullDate } from '../../utils/converDateTime';
import Loading from '../Loading';

const screen = Dimensions.get('screen');

const DiaryList = ({ topic, searchKey, navigation }) => {
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const diaries = useSelector(diarySelectors.getDiaries);

  const isDecodeToken = useDecodeToken();

  const {
    data: diaryList,
    isLoading: isGettingDiaries,
    refetch,
  } = useQuery(
    ['diaries'],
    async () => {
      const response = await axiosConfig.get('Diary/get-diaries-by-topic-id', {
        params: { topicId: topic.topicId, searchKey: searchKey },
      });
      console.log('get diaries res', response.data);
      return response.data;
    },
    {
      onError: () => {
        console.log('error get topics');
      },
    },
  );

  console.log('get diaries', diaryList);

  useEffect(() => {
    if (isFocused) {
      refetch();
      diaries.map((diary) => {
        setTimeout(() => {
          if (!diary.content || diary.content === '') {
            dispatch(diaryActions.removeDiaryFromList(diary));
          }
        }, 800);
      });
    }
  }, [isFocused, searchKey]);

  useEffect(() => {
    if (diaryList) {
      //console.log('list', diaryList);
      dispatch(diaryActions.setDiaries(diaryList));
    }
  }, [diaryList]);

  if (isGettingDiaries) {
    return (
      <View style={styles.loading}>
        <Loading />
      </View>
    );
  }

  const source = {
    html: '',
  };

  const WebDisplay = React.memo(function WebDisplay({ content }) {
    const imgWidth = (screen.width - 80) / 3;
    const tagsStyles = {
      body: {
        whiteSpace: 'normal',
        color: 'gray',
      },
      div: {
        fontSize: '3px',
      },
      p: {
        fontSize: '3px',
      },
      img: {
        height: 'auto',
        width: 'auto',
        maxWidth: `${imgWidth}px`,
        maxHeight: `${imgWidth}px`,
        transform: [{ scale: 0.5 }],
      },
    };
    return (
      <RenderHTML
        enableExperimentalBRCollapsing={true}
        enableExperimentalMarginCollapsing={true}
        contentWidth={width}
        source={{ html: content }}
        tagsStyles={tagsStyles}
      />
    );
  });

  const TitleDisplay = React.memo(function WebDisplay({ content }) {
    const tagsStyles = {
      body: {
        whiteSpace: 'normal',
        color: 'gray',
        textAlign: 'center',
      },
      div: {
        fontSize: '14px',
      },
      p: {
        fontSize: '14px',
      },
    };
    return (
      <RenderHTML
        enableExperimentalBRCollapsing={true}
        enableExperimentalMarginCollapsing={true}
        contentWidth={width}
        source={{ html: content }}
        tagsStyles={tagsStyles}
      />
    );
  });

  return (
    <ScrollView contentContainerStyle={styles.list}>
      {diaries.map((diary) => (
        <View style={styles.listItemContainer} key={diary.diaryId}>
          <SharedElement id={diary.diaryId}>
            <TouchableOpacity
              onPress={() => navigation.navigate('DiaryEdit', { diary: diary })}
              onLongPress={() => navigation.navigate('DiaryOption', { diary: diary })}
              style={styles.listItem}
            >
              <WebDisplay content={diary.content ? diary.content : source.html} />
              {diary.isLiked && <List.Icon color="#ff5353" style={styles.heart} icon="heart" />}
              {diary.status === diaryStatus.public && (
                <List.Icon style={styles.public} icon="share" />
              )}
            </TouchableOpacity>
          </SharedElement>
          <View style={styles.title}>
            <TitleDisplay content={shortenTitle(diary.content)} />
          </View>
          <Paragraph style={styles.createAt}>{getFullDate(diary.createAt)}</Paragraph>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loading: {
    height: screen.height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItemContainer: {
    alignItems: 'center',
  },
  listItem: {
    height: (screen.width - 80) / 3,
    width: (screen.width - 80) / 3,
    margin: 10,
    backgroundColor: '#fbead1',
    borderRadius: 7,
    padding: 10,
    overflow: 'hidden',
  },
  title: {
    height: 16,
    width: (screen.width - 120) / 3,
    alignItems: 'center',
    overflow: 'hidden',
  },
  createAt: {
    fontSize: 10,
    marginBottom: 20,
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'flex-start',
    marginTop: 20,
  },
  heart: {
    position: 'absolute',
    transform: [{ scale: 0.5 }],
    zIndex: 2,
    bottom: -15,
    right: -15,
  },
  public: {
    position: 'absolute',
    transform: [{ scale: 0.5 }],
    zIndex: 3,
    top: -15,
    right: -15,
  },
});

export default DiaryList;
