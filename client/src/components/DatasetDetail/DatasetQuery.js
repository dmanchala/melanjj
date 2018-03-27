import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Button, Input } from 'antd';

const { TextArea } = Input;

/* eslint react/prefer-stateless-function: 0 */
class DatasetQuery extends Component {
  render() {
    let content;

    if (this.props.auth && this.props.auth.approved) {
      content = (
        <Button size="large" style={{ width: '100%', margin: '0 auto;' }}>
          Run
        </Button>
      );
    } else if (this.props.auth) {
      content = (
        <div>
          Thanks for signing up. We&apos;ll email you once your account is
          activated.
        </div>
      );
    } else if (this.props.auth === false) {
      content = [
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
    } else if (this.props.auth === null) {
      content = null;
    }
    return (
      <Card
        cover={
          <TextArea
            rows={20}
            disabled={!this.props.auth || !this.props.auth.approved}
          />
        }
      >
        {content}
      </Card>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(DatasetQuery);
