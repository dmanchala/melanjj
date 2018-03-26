import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Menu, Layout } from 'antd';

const { Item } = Menu;

class Header extends Component {
  /* eslint class-methods-use-this: 0 */
  renderAuthOptions() {
    switch (this.props.auth) {
      case null:
        return null;
      case false:
        return [<Item key="3">Log In</Item>, <Item key="4">Sign Up</Item>];
      default:
        return <Item key="4">Log Out</Item>;
    }
  }

  render() {
    return (
      <Layout.Header className="header">
        <Menu theme="dark" mode="horizontal" style={{ lineHeight: '64px' }}>
          <Item key="1" style={{ fontSize: 'xx-large' }}>
            Melanjj
          </Item>
          <Item key="2">Million Song Dataset</Item>
          {this.renderAuthOptions()}
        </Menu>
      </Layout.Header>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(Header);
