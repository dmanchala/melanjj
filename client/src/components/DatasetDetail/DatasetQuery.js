import React, { Component } from 'react';
import { Card, Button, Input } from 'antd';

const { TextArea } = Input;

/* eslint react/prefer-stateless-function: 0 */
class DatasetQuery extends Component {
  render() {
    return (
      <Card cover={<TextArea rows={20} />}>
        <Button size="large" style={{ width: '100%', margin: '0 auto;' }}>
          Run
        </Button>
      </Card>
    );
  }
}

export default DatasetQuery;
