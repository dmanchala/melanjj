import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Header from './components/Header';
import Landing from './components/Landing';
import DatasetDetail from './components/DatasetDetail';
import SignupThankYou from './components/SignupThankYou';

const App = () => (
  <div>
    <BrowserRouter>
      <div>
        <Header />
        <Route exact path="/" component={Landing} />
        <Route
          exact
          path="/datasets/melanjj/million-song-dataset"
          component={DatasetDetail}
        />
        <Route exact path="/signup-thank-you" component={SignupThankYou} />
      </div>
    </BrowserRouter>
  </div>
);

export default App;
