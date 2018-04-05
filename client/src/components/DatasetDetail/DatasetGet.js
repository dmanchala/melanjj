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

class DatasetCollections extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collections: props.collections,
      activeCollectionKey: props.collections ? props.collections[0].name : null,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.collections) {
      this.setState({
        collections: nextProps.collections,
        activeCollectionKey: nextProps.collections[0].name,
      });
    }
  }

  loading() {
    return this.state.activeCollectionKey === null;
  }

  activeCollection() {
    return this.state.collections.filter(
      ({ name }) => name === this.state.activeCollectionKey,
    )[0];
  }

  activeCollectionName() {
    return this.activeCollection().name;
  }

  renderCollectionsMenu() {
    if (this.loading()) {
      return null;
    }

    return this.state.collections.map((collection) => (
      <Menu.Item key={collection.name}>{collection.name}</Menu.Item>
    ));
  }

  render() {
    if (this.loading()) {
      return <Card loading={this.loading()} bordered={false} />;
    }

    return (
      <div>
        <Dropdown
          overlay={
            <Menu
              selectable
              defaultSelectedKeys={[this.state.activeCollectionKey]}
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
          rowKey={(row) => row.name}
          columns={columns}
          size="small"
          scroll={{ y: 400 }}
          pagination={false}
        />
      </div>
    );
  }
}

class DatasetInfo extends Component {
  state = {
    activeKey: 'collections',
    dataset: {},
    activeCollectionKey: null,
  };

  async componentWillMount() {
    const res = await axios.get(`/api/datasets/melanjj/${this.props.dataset}`);
    this.setState({
      dataset: res.data,
      activeCollectionKey: res.data.collections[0].name,
    });
  }

  onClickMenuItem = (e) => {
    this.setState({ activeCollectionKey: e.key });
  };

  onTabChange = (key) => {
    this.setState({ activeKey: key });
  };

  loading() {
    return !this.state.dataset.name;
  }

  renderAbout() {
    if (this.loading()) {
      return <Card loading={this.loading()} bordered={false} />;
    }

    return (
      <div>
        <h2>{this.state.dataset.formattedName}</h2>
        <ReactMarkdown source={this.state.dataset.description} />
      </div>
    );
  }

  renderActiveTab() {
    if (this.state.activeKey === 'about') {
      return this.renderAbout();
    }
    return <DatasetCollections collections={this.state.dataset.collections} />;
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
            <DatasetInfo dataset={this.dataset} />
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
