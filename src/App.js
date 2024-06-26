import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DogList from './components/DogList';
import AddDog from './components/AddDog';
import DogDetail from './components/DogDetail';
import UserDogPage from './components/UserDogPage';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={DogList} />
        <Route path="/add-dog" component={AddDog} />
        <Route path="/dog/:id" component={DogDetail} />
        <Route path="/user-dog/:id" component={UserDogPage} />
      </Switch>
    </Router>
  );
};

export default App;
