import React from 'react';
import { Card } from 'antd';

const DatasetQueryForm = () => (
  <Card style={{ width: '50% ' }} bordered={false} />
);

const DatasetGet = () => (
  <div style={{ padding: 25 }}>
    <Card title="Get Dataset">
      <DatasetQueryForm />
    </Card>
  </div>
);

export default DatasetGet;
