import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Header from './components/Header';
import Landing from './components/Landing';
import DatasetDetail from './components/DatasetDetail';
import SignupThankYOu from './components/SignupThankYou';

const App = () => (
  <div>
    <BrowserRouter>
      <div>
        <Route path="/" component={Landing} />
      </div>
    </BrowserRouter>
  </div>
);

export default App;
