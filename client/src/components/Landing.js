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
        want. Get the million song dataset now.
      </div>
      <div>
        <Button type="primary" size="large" style={{ marginTop: 10 }}>
          <a href="/auth/google">Sign Up</a>
        </Button>
      </div>
    </div>
  </Card>
);

export default Landing;
