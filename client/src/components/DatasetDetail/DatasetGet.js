import React from 'react';
import { Card, Button, Dropdown, Icon, Menu, Input, Col, Row } from 'antd';

const { TextArea } = Input;

const menu = (
  <Menu>
    <Menu.Item key="0">1st menu item</Menu.Item>
    <Menu.Item key="1">2nd menu item</Menu.Item>
    <Menu.Item key="2">3rd menu item</Menu.Item>
  </Menu>
);

const DatasetGet = () => (
  <div style={{ padding: 10 }}>
    <Row gutter={1}>
      <Col span={8}>
        <Card cover={<TextArea rows={20} />}>
          <Button size="large" style={{ width: '100%', margin: '0 auto;' }}>
            Run
          </Button>
        </Card>
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
              <a className="ant-dropdown-link" href="#">
                Collection Picker <Icon type="down" />
              </a>
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

export default DatasetGet;
