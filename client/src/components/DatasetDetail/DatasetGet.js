import React, { Component } from 'react';
import { Card, Menu, Col, Row, Dropdown, Icon, Table, Tooltip } from 'antd';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import * as strings from './helpAndExampleTextStrings';
import DatasetQuery from './DatasetQuery';

const leftTabList = [
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
    if (this.loading()) {
      return <Card key="0" loading={this.loading()} bordered={false} />;
    }

    return [
      <h2>{this.state.dataset.formattedName}</h2>,
      <ReactMarkdown source={this.state.dataset.description} />,
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
    if (this.loading()) {
      return <Card key="0" loading={this.loading()} bordered={false} />;
    }

    return [
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
      </Dropdown>,
      <p />,
      <ReactMarkdown source={this.activeCollection().description} />,
      <h2>Columns</h2>,
      <Table
        dataSource={this.activeCollection().columns}
        columns={columns}
        size="small"
        scroll={{ y: 400 }}
        pagination={false}
      />,
    ];
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
        tabList={leftTabList}
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

const rightTabList = [
  {
    key: 'help',
    tab: 'Help',
  },
  {
    key: 'examples',
    tab: 'Examples',
  },
];

class DatasetHelp extends Component {
  static renderHelp() {
    return <ReactMarkdown source={strings.helpText} />;
  }

  static renderExamples() {
    return <ReactMarkdown source={strings.examplesText} />;
  }

  state = {
    activeKey: 'help',
  };

  onTabChange = (key) => {
    this.setState({ activeKey: key });
  };

  renderActiveTab() {
    if (this.state.activeKey === 'help') {
      return DatasetHelp.renderHelp();
    }
    return DatasetHelp.renderExamples();
  }

  render() {
    return (
      <Card
        style={{ width: '100%', wordWrap: 'break-word' }}
        tabList={rightTabList}
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
            <DatasetHelp />
          </Col>
        </Row>
      </div>
    );
  }
}

export default DatasetGet;
