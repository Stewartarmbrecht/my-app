import 'core-js/full/symbol/async-iterator';

import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  SafeAreaView,
} from 'react-native';
import {DataStore} from 'aws-amplify';
import {LazyTodo, Todo} from './src/models/index';

import { Amplify } from 'aws-amplify';
import awsExports from './src/aws-exports';
Amplify.configure(awsExports);

import { ExpoSQLiteAdapter } from '@aws-amplify/datastore-storage-adapter/ExpoSQLiteAdapter';

DataStore.configure({
  storageAdapter: ExpoSQLiteAdapter
});

const initialState: Todo = new Todo({name: '', description: ''});

const App = () => {
  const [formState, setFormState] = useState<LazyTodo>(initialState);
  const [todos, setTodos] = useState<LazyTodo[]>([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  function setInput(key, value) {
    setFormState({...formState, [key]: value});
  }

  async function fetchTodos() {
    try {
      //const todoData = await API.graphql(graphqlOperation(listTodos));
      const todos = await DataStore.query(Todo);
      //const todos = todoData.data.listTodos.items;
      setTodos(todos);
      console.log('Set Todos', todos);
    } catch (err) {
      console.log('error fetching todos', err);
    }
  }

  async function addTodo() {
    try {
      if (!formState.name || !formState.description) return;
      const todo = {...formState};
      setTodos([...todos, todo]);
      setFormState(initialState);
      //await API.graphql(graphqlOperation(createTodo, {input: todo}));
      await DataStore.save(new Todo(todo));
    } catch (err) {
      console.log('error creating todo:', err);
    }
  }

  async function sync() {
    try {
      setTodos([]);
      console.log('Stopping');
      await DataStore.stop();
      console.log('Clearing');
      await DataStore.clear();
      console.log('Starting');
      await DataStore.start();
      console.log('Fetching');
      fetchTodos();
    } catch (err) {
      console.log('error syncing:', err);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <TextInput
          onChangeText={value => setInput('name', value)}
          style={styles.input}
          value={formState.name}
          placeholder="Name"
        />
        <TextInput
          onChangeText={value => setInput('description', value)}
          style={styles.input}
          value={formState.description ?? undefined}
          placeholder="Description"
        />
        <Pressable onPress={addTodo} style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Create todo</Text>
        </Pressable>
        <Pressable onPress={sync} style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Sync</Text>
        </Pressable>
        <Pressable onPress={fetchTodos} style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Refresh</Text>
        </Pressable>
        {todos.map((todo, index) => (
          <View key={todo.id ? todo.id : index} style={styles.todo}>
            <Text style={styles.todoName}>{todo.name}</Text>
            <Text style={styles.todoDescription}>{todo.description}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {width: 400, flex: 1, padding: 20, alignSelf: 'center'},
  todo: {marginBottom: 15},
  input: {backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 18},
  todoName: {fontSize: 20, fontWeight: 'bold'},
  todoDescription: {fontSize: 20, fontWeight: 'bold'},
  buttonContainer: {
    alignSelf: 'center',
    backgroundColor: 'black',
    paddingHorizontal: 8,
  },
  buttonText: {color: 'white', padding: 16, fontSize: 18},
});