import React, { Component } from 'react';
import { Menu, Layout } from 'antd';

const { Item } = Menu;

class Header extends Component {
  /* eslint class-methods-use-this: 0 */
  renderOptions() {
    return [
      <Item key="2">Million Song Dataset</Item>,
      <Item key="3">Log In</Item>,
      <Item key="4">Sign Up</Item>,
    ];
  }

  render() {
    return (
      <Layout.Header className="header">
        <Menu theme="dark" mode="horizontal" style={{ lineHeight: '64px' }}>
          <Item key="1" style={{ fontSize: 'xx-large' }}>
            Melanjj
          </Item>
          {this.renderOptions()}
        </Menu>
      </Layout.Header>
    );
  }
}

export default Header;
