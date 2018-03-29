import React, { Component } from 'react';
import { Card, Menu, Col, Row } from 'antd';
import axios from 'axios';

import DatasetQuery from './DatasetQuery';

const menu = (
  <Menu>
    <Menu.Item key="0">1st menu item</Menu.Item>
    <Menu.Item key="1">2nd menu item</Menu.Item>
    <Menu.Item key="2">3rd menu item</Menu.Item>
  </Menu>
);

const tabList = [
  {
    key: 'about',
    tab: 'About',
  },
  {
    key: 'collections',
    tab: 'Collections',
  },
];

class DatasetAbout extends Component {
  state = {
    activeKey: 'about',
    dataset: {},
  };

  async componentWillMount() {
    const res = await axios.get(`/api/datasets/melanjj/${this.props.dataset}`);
    this.setState({ dataset: res.data });
  }

  onTabChange = (key) => {
    this.setState({ activeKey: key });
  };

  loading() {
    return this.state.activeKey === 'about' && !this.state.dataset.name;
  }

  renderAbout() {
    return [
      <Card key="0" loading={this.loading()} bordered={false}>
        <h2>{this.state.dataset.formattedName}</h2>
        <div>{this.state.dataset.description}</div>
        <p />
        <h3>Citation</h3>
        <div>{this.state.dataset.citation}</div>
        <p />
        <a href={this.state.dataset.source}>Source</a>
      </Card>,
    ];
  }

  render() {
    return (
      <Card
        style={{ width: '100%', wordWrap: 'break-word' }}
        tabList={tabList}
        activeTabKey={this.state.activeKey}
        onTabChange={(key) => {
          this.onTabChange(key);
        }}
      >
        {this.renderAbout()}
      </Card>
    );
  }
  // <Card title="Collections">
  //   <Card bordered={false}>
  //     <Dropdown overlay={menu}>
  //       <div className="ant-dropdown-link">
  //         Collection Picker <Icon type="down" />
  //       </div>
  //     </Dropdown>
  //   </Card>
  //   <Card title="Summary" bordered={false}>
  //     Summary
  //   </Card>
  //   <Card title="Columns" bordered={false}>
  //     Columns
  //   </Card>
  // </Card>
}

/* eslint react/no-multi-comp: 0 */
class DatasetGet extends Component {
  constructor(props) {
    super(props);
    this.dataset = this.props.match.params.dataset;
  }

  render() {
    return (
      <div style={{ padding: 10 }}>
        <Row gutter={1}>
          <Col span={8}>
            <DatasetAbout dataset={this.dataset} />
          </Col>
          <Col span={8}>
            <DatasetQuery />
          </Col>
          <Col span={8}>
            <Card title="Help">
              <Card bordered={false}>How to use</Card>
              <Card title="Query syntax" bordered={false}>
                Query syntax
              </Card>
              <Card title="Example query" bordered={false}>
                Example query
              </Card>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default DatasetGet;
