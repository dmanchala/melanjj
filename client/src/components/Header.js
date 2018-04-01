import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Menu, Layout, Dropdown, Icon } from 'antd';

const { Item } = Menu;

class Header extends Component {
  state = {
    collapsed: true,
  };

  toggleCollapsed = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  menu() {
    return (
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
    );
  }

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
        <Dropdown overlay={this.menu()} trigger={['click']}>
          <a
            className="ant-dropdown-link"
            href="#"
            onClick={this.toggleCollapsed}
          >
            <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
          </a>
        </Dropdown>
      </Layout.Header>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(Header);
