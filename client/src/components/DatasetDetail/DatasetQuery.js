import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Button, Input, Form } from 'antd';
import axios from 'axios';
import * as actions from '../../actions';

const { TextArea } = Input;

/* eslint react/prefer-stateless-function: 0 */

const SignUpLogInContent = () => [
  <div style={{ marginBottom: 10 }}>
    Please sign up or log in to query this dataset.
  </div>,
  <div>
    <Button size="large">
      <a href="/auth/google">Log In</a>
    </Button>
    <Button size="large" style={{ marginLeft: 10 }}>
      <a href="/auth/google">Sign Up</a>
    </Button>
  </div>,
];

const AccountNotApprovedText = () => (
  <div>
    Thanks for signing up. We&apos;ll email you once your account is activated.
  </div>
);

class DatasetQuery extends Component {
  constructor(props) {
    super(props);
    this.state = { query: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.fetchUser();
  }

  handleChange(event) {
    this.setState({ query: event.target.value });
  }

  async handleSubmit(event) {
    event.preventDefault();
    const { err, res } = await axios.post('/api/queryDataset', {
      query: this.state.query,
    });
    console.log(err);
    console.log(res);
  }

  render() {
    const textArea = (
      <TextArea
        type="text"
        rows={20}
        value={this.state.query}
        onChange={this.handleChange}
        disabled={!this.props.auth || !this.props.auth.approved}
      />
    );
    let content;
    if (this.props.auth && this.props.auth.approved) {
      content = (
        <Button
          size="large"
          style={{ width: '100%', margin: '0 auto' }}
          htmlType="submit"
        >
          Run
        </Button>
      );
    } else if (this.props.auth) {
      content = <AccountNotApprovedText />;
    } else if (this.props.auth === false) {
      content = SignUpLogInContent();
    } else if (this.props.auth === null) {
      content = null;
    }
    return (
      <Form onSubmit={this.handleSubmit}>
        <Card cover={textArea}>{content}</Card>
      </Form>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps, actions)(Form.create()(DatasetQuery));
