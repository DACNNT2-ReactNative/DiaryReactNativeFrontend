import { StyleSheet, View } from 'react-native';
import AddTopicDialog from '../components/dialogs/AddTopicDialog';
import DeleteTopicDialog from '../components/dialogs/DeleteTopicDialog';
import UpdateTopicDialog from '../components/dialogs/UpdateTopicDialog';
import TopicList from '../components/topic/TopicList';

function Home({ navigation }) {  
  return (
    <View style={styles.container}>
      <TopicList navigation={navigation} />
      <AddTopicDialog />
      <UpdateTopicDialog />
      <DeleteTopicDialog />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default Home;
