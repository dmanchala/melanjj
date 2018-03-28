import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Menu, Layout } from 'antd';

const { Item } = Menu;

class Header extends Component {
  renderAuthOptions() {
    switch (this.props.auth) {
      case null:
        return null;
      case false:
        return [
          <Item key="3">
            <a href="/auth/google">Log In</a>
          </Item>,
          <Item key="4">
            <a href="/auth/google">Sign Up</a>
          </Item>,
        ];
      default:
        return (
          <Item key="4">
            <a href="/api/logout">Log Out</a>
          </Item>
        );
    }
  }

  render() {
    return (
      <Layout.Header className="header">
        <Menu theme="dark" mode="horizontal" style={{ lineHeight: '64px' }}>
          <Item key="1" style={{ fontSize: 'xx-large' }}>
            <Link to="/">Melanjj</Link>
          </Item>
          <Item key="2">
            <Link to="/datasets/melanjj/million-song-dataset">
              Million Song Dataset
            </Link>
          </Item>
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
