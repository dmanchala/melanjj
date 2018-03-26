import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import * as actions from './actions';
import './App.css';
import Header from './components/Header';
import Landing from './components/Landing';
import DatasetDetail from './components/DatasetDetail/DatasetDetail';
import SignupThankYou from './components/SignupThankYou';

class App extends Component {
  componentDidMount() {
    this.props.fetchUser();
  }

  render() {
    return (
      <BrowserRouter>
        <Layout>
          <Header />
          <Route exact path="/" component={Landing} />
          <Route
            exact
            path="/datasets/melanjj/million-song-dataset"
            component={DatasetDetail}
          />
          <Route exact path="/signup-thank-you" component={SignupThankYou} />
        </Layout>
      </BrowserRouter>
    );
  }
}

export default connect(null, actions)(App);
