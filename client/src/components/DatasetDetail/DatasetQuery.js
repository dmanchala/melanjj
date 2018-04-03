import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Button, Input, Form, Modal } from 'antd';
import axios from 'axios';
import * as actions from '../../actions';

window.axios = axios;

const { TextArea } = Input;
const { confirm } = Modal;

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
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  state = { query: '' };

  componentDidMount() {
    this.props.fetchUser();
  }

  handleChange(event) {
    this.setState({ query: event.target.value });
  }

  async handleSubmit(event) {
    event.preventDefault();

    await axios(
      `${window.location.origin}/api/queryDataset?query=${this.state.query}`,
    );

    confirm({
      title: 'Download query results?',
      onOk() {
        window.location = `${window.location.origin}/api/downloadDataset`;
      },
    });
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
        <Card title="Download" cover={textArea}>
          {content}
        </Card>
      </Form>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps, actions)(Form.create()(DatasetQuery));
