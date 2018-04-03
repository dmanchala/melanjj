import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Menu, Layout, Dropdown, Icon, Button } from 'antd';

const { Item } = Menu;

class Header extends Component {
  state = {
    collapsed: true,
    windowOuterWidth: window.outerWidth,
  };

  componentDidMount() {
    window.addEventListener('resize', this.updateWindowOuterWidth);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowOuterWidth);
  }

  updateWindowOuterWidth = () => {
    this.setState({ windowOuterWidth: window.outerWidth });
  };

  toggleCollapsed = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  windowIsSmall = () => this.state.windowOuterWidth < 576;

  logoStyle = () => ({
    fontSize: this.windowIsSmall() ? 'medium' : 'xx-large',
  });

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

  renderMenu() {
    return (
      <Menu theme="dark" mode="horizontal" style={{ lineHeight: '64px' }}>
        <Item key="1" style={this.logoStyle()}>
          <Link to="/">Melanjj</Link>
        </Item>
        <Item key="2">
          <Link to="/datasets/melanjj/million_song_dataset">
            Million Song Dataset
          </Link>
        </Item>
        {this.renderAuthOptions()}
      </Menu>
    );
  }

  renderHorizontalOrDropdownMenu() {
    if (this.windowIsSmall()) {
      return (
        <Dropdown overlay={this.renderMenu()} trigger={['click']}>
          <Button
            ghost
            className="ant-dropdown-link"
            href="#"
            onClick={this.toggleCollapsed}
          >
            <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
          </Button>
        </Dropdown>
      );
    }

    return this.renderMenu();
  }

  render() {
    return (
      <Layout.Header className="header">
        {this.renderHorizontalOrDropdownMenu()}
      </Layout.Header>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(Header);
