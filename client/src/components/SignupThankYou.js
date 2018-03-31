import React from 'react';
import { Card } from 'antd';

const SignupThankYou = () => (
  <Card>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 64, fontWeight: 500 }}>
        That&apos;s it. You did it.
      </div>
      <div style={{ fontSize: 'x-large' }}>
        Thanks for signing up. We&apos;ll email you once your account is
        activated.
      </div>
    </div>
  </Card>
);

export default SignupThankYou;
