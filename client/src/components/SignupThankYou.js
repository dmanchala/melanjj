import React from 'react';
import { Layout } from 'antd';

const { Content } = Layout;

const SignupThankYou = () => (
  <Content style={{ padding: 50 }}>
    <div
      style={{
        background: '#fff',
        padding: 24,
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 64, fontWeight: 500 }}>
        That&apos;s it. You did it.
      </div>
      <div style={{ fontSize: 'x-large' }}>
        Thanks for signing up. We&apos;ll email you once your account is
        activated.
      </div>
    </div>
  </Content>
);

export default SignupThankYou;
