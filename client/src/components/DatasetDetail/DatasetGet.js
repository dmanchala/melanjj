import React, { Component } from 'react';
import { Card, Dropdown, Icon, Menu, Col, Row } from 'antd';
import axios from 'axios';

import DatasetQuery from './DatasetQuery';

const menu = (
  <Menu>
    <Menu.Item key="0">1st menu item</Menu.Item>
    <Menu.Item key="1">2nd menu item</Menu.Item>
    <Menu.Item key="2">3rd menu item</Menu.Item>
  </Menu>
);

class DatasetGet extends Component {
  async componentDidMount() {
    this.dataset = this.props.match.params.dataset;
    const response = await axios.get(`/api/${this.dataset}/desc.html`);
    const desc = response.data;
    console.log(desc);
  }

  render() {
    return (
      <div style={{ padding: 10 }}>
        <Row gutter={1}>
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
          <Col span={8}>
            <Card title="Collections">
              <Card bordered={false}>
                <Dropdown overlay={menu}>
                  <div className="ant-dropdown-link">
                    Collection Picker <Icon type="down" />
                  </div>
                </Dropdown>
              </Card>
              <Card title="Summary" bordered={false}>
                Summary
              </Card>
              <Card title="Columns" bordered={false}>
                Columns
              </Card>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default DatasetGet;
