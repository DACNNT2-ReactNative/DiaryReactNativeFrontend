import React from 'react';
import { Paragraph } from 'react-native-paper';
import Button from '../components/Button';

const DiaryList = ({route, navigation}) => {
  console.log(route.params, navigation);
  return (
    <>
      <Paragraph>DiaryList</Paragraph>
      <Button onPress={() => navigation.navigate('DiaryEdit')}>Go</Button>
    </>
  );
};

export default DiaryList;
