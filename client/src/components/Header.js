import React from 'react';
import { Menu, Layout } from 'antd';

const { Item } = Menu;

const Header = () => (
  <Layout.Header className="header">
    <Menu theme="dark" mode="horizontal" style={{ lineHeight: '64px' }}>
      <Item key="1" style={{ fontSize: 'xx-large' }}>
        Melanjj
      </Item>
      <Item key="2">Million Song Dataset</Item>
      <Item key="3">Log In</Item>
      <Item key="4">Sign Up</Item>
    </Menu>
  </Layout.Header>
);

export default Header;
