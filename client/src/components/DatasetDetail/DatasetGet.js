import React, { Component } from 'react';
import { Card, Menu, Col, Row, Dropdown, Icon, Table, Tooltip } from 'antd';
import axios from 'axios';
import DatasetQuery from './DatasetQuery';
import ReactMarkdown from 'react-markdown';

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

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => (
      <Tooltip title={record.description}>
        <div>{text}</div>
      </Tooltip>
    ),
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    align: 'left',
    width: '33%',
  },
];

class DatasetAbout extends Component {
  state = {
    activeKey: 'about',
    dataset: {},
    activeCollectionIndex: null,
  };

  async componentWillMount() {
    const res = await axios.get(`/api/datasets/melanjj/${this.props.dataset}`);
    console.log(res.data.collections[0].columns);
    this.setState({
      dataset: res.data,
      activeCollectionIndex: '0',
    });
  }

  onClickMenuItem = (e) => {
    this.setState({ activeCollectionIndex: e.key });
  };

  onTabChange = (key) => {
    this.setState({ activeKey: key });
  };

  loading() {
    return this.state.activeKey === 'about' && !this.state.dataset.name;
  }

  activeCollection() {
    return this.state.dataset.collections[
      Number(this.state.activeCollectionIndex)
    ];
  }

  activeCollectionName() {
    return this.activeCollection().name;
  }

  renderAbout() {
    return [
      <Card key="0" loading={this.loading()} bordered={false}>
        <h2>{this.state.dataset.formattedName}</h2>
        <ReactMarkdown source={this.state.dataset.description} />
      </Card>,
    ];
  }

  /* eslint react/no-array-index-key: 0 */
  renderCollectionsMenu() {
    if (this.loading()) {
      return null;
    }

    return this.state.dataset.collections.map((collection, i) => (
      <Menu.Item key={i}>{collection.name}</Menu.Item>
    ));
  }

  renderCollections() {
    const source = `${JSON.stringify(
      this.activeCollection().columns,
      null,
      2,
    )}`;

    return (
      <Card loading={this.loading()} bordered={false}>
        <Dropdown
          overlay={
            <Menu
              selectable
              defaultSelectedKeys={[this.state.activeCollectionIndex]}
              onClick={this.onClickMenuItem}
            >
              {this.renderCollectionsMenu()}
            </Menu>
          }
        >
          <div className="ant-dropdown-link">
            {this.activeCollectionName()}
            <Icon type="down" />
          </div>
        </Dropdown>
        <p />
        <ReactMarkdown source={this.activeCollection().description} />
        <h2>Columns</h2>
        <Table
          dataSource={this.activeCollection().columns}
          columns={columns}
          size="small"
          scroll={{ y: 400 }}
          pagination={false}
        />
      </Card>
    );
  }

  renderActiveTab() {
    if (this.state.activeKey === 'about') {
      return this.renderAbout();
    }
    return this.renderCollections();
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
        {this.renderActiveTab()}
      </Card>
    );
  }
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
        <Row>
          <Col style={{ padding: 2 }} xs={24} sm={24} md={8} l={8}>
            <DatasetAbout dataset={this.dataset} />
          </Col>
          <Col style={{ padding: 2 }} xs={24} sm={24} md={8} l={8}>
            <DatasetQuery />
          </Col>
          <Col style={{ padding: 2 }} xs={24} sm={24} md={8} l={8}>
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
