import { StyleSheet, View } from 'react-native';
import AddTopicDialog from '../components/dialogs/AddTopicDialog';
import DeleteTopicDialog from '../components/dialogs/DeleteTopicDialog';
import UpdateTopicDialog from '../components/dialogs/UpdateTopicDialog';
import Loading from '../components/Loading';
import TopicList from '../components/topic/TopicList';
import { useDecodeToken } from '../hooks/useDecodeToken';

function Home({ navigation }) {
  const isDecodeToken = useDecodeToken();
  if (isDecodeToken) {
    return (
      <View style={styles.container}>
        <Loading />
      </View>
    );
  }
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
