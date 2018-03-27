import React from 'react';
import { Button, Card } from 'antd';

const Landing = () => (
  <Card>
    <div>
      <div
        style={{
          fontSize: 48,
          fontWeight: 500,
          textTransform: 'capitalize',
        }}
      >
        only the rows and columns you care about.
      </div>
      <div
        style={{
          fontSize: 24,
          height: 'auto',
        }}
      >
        Use our query tool to quickly download the portions of big datasets you
        want.
      </div>
      <div>
        <Button type="primary" size="large" style={{ marginTop: 10 }}>
          Explore The Million Song Dataset
        </Button>
        <Button size="large" style={{ marginLeft: 10, marginTop: 10 }}>
          Request A Dataset
        </Button>
      </div>
    </div>
  </Card>
);

export default Landing;
