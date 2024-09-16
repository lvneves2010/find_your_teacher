/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import type {PropsWithChildren} from 'react';
import {
  Button,
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import NewHeader from './components/Header';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [userType, setUserType] = useState('');
  const [email, setEmail] = useState('');
  const [discipline, setDiscipline] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Fetch users from the API when the component loads
  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to fetch users from the API
  const fetchUsers = async () => {
    setError('');
    try {
      setLoading(true);
      const response = await axios.get('http://192.168.1.121:5000/api/users');
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Error fetching users');
      console.error(err);
    }
  };
  // Function to create a new user
  const handleCreateUser = async () => {
    setError('');
    try {
      setLoading(true);
      const newUser = { name, userType, email, discipline };
      await axios.post('http://192.168.1.121:5000/api/users', newUser);
      setName('');
      setUserType('');
      setEmail('');
      setDiscipline('');
      fetchUsers(); // Refresh user list after adding a new user
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Error creating user');
      console.error(err);
    }
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <NewHeader />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="">
            {/* Display error message if any */}
            {error && <Text style={styles.errorMessage}>{error}</Text>}

            {/* Loading indicator */}
            {loading && <Text>Loading...</Text>}
          </Section>
          <Section title="User Management">
            {/* Form to create a new user */}
            <View>
              <View>
                <Text style={styles.label}>Name:</Text>
                <TextInput
                  value={name}
                  onChangeText={(e: any) => setName(e)}
                />
              </View>
              <View>
                <Text style={styles.label}>Type:</Text>
                <TextInput
                  value={userType}
                  onChangeText={(e: any) => setUserType(e)}
                />
              </View>
              <View>
                <Text style={styles.label}>Email:</Text>
                <TextInput
                  value={email}
                  onChangeText={(e: any) => setEmail(e)}
                />
              </View>
              <View>
                <Text style={styles.label}>Discipline:</Text>
                <TextInput
                  value={discipline}
                  onChangeText={(e: any) => setDiscipline(e)}
                />
              </View>
              <Button title="Create User" onPress={handleCreateUser}/>
            </View>
          </Section>
          <Section title="List of Providers">
            <FlatList
              data={users.filter((user: any) => user.userType === 'Provider')}
              keyExtractor={(item: any) => item.id}
              renderItem={({ item }) => (
                <View style={styles.itemContainer}>
                  <Text style={styles.list}>{item.name} ({item.email})</Text>
                  {item.discipline && <Text style={styles.list}>{item.discipline}</Text>}
                </View>
              )}
             />
          </Section>
          <Section title="List of Consumers">
            <FlatList
              data={users.filter((user: any) => user.userType === 'Consumer')}
              keyExtractor={(item: any) => item.id}
              renderItem={({ item }) => (
                <View style={styles.itemContainer}>
                  <Text style={styles.list}>{item.name} ({item.email})</Text>
                  {item.discipline && <Text style={styles.list}>{item.discipline}</Text>}
                </View>
              )}
             />
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  highlight: {
    fontWeight: '700',
  },
  list: {
    fontSize: 14,
    color: 'gray',
  },itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  errorMessage: {
    color: 'red',
  },
});

export default App;
