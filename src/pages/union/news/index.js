import React, { Component } from 'react'
import { connect } from 'dva'
import { Button, Table, Input, Popconfirm, message } from 'antd'
import EllipsisTooltip from '@/components/ellipsisTooltip'
import NewsItem from './item'
import UnionItem from '../../components/unionItem'
import style from './index.scss'

const namespace = 'memorabilia'
@connect(({ memorabilia,union, loading }) => ({ memorabilia,union, dataLoading: loading.effects[`${namespace}/fetchMemorabiliaList`] }))
class News extends Component {
  state = {
    name: '',
    showItem: false,
    detailData: null,
    showUnionItem: false
  }
  componentDidMount() {
      let searchConf = {
        currentPage: 1,
        pageSize: 10,
        name: '',
        category: '0703',
        alliance: localStorage.getItem('alliance')
      }
      this.props.dispatch({
        type: `${namespace}/changeMemorabiliaConf`,
        payload: searchConf,
      })
      this.props.dispatch({
        type: `${namespace}/fetchMemorabiliaList`
      })
  }
  componentWillUnmount() {
    let searchConf = {
      currentPage: 1,
      pageSize: 10,
      name: '',
      category: '',
      alliance: null,
    }
    this.props.dispatch({
      type: `${namespace}/changeMemorabiliaConf`,
      payload: searchConf,
    })
    this.props.dispatch({
      type: `${namespace}/changeMemorabiliaList`,
      payload: {
          memorabiliaList: [],
          memorabiliaTotal: 0
      }
   })
  }

  onChangeName = e => {
    this.setState({
      name: e.target.value
    })
  }


  toSearch = () => {
    const { memorabiliaConf } = this.props[namespace];
    const { name } = this.state
    memorabiliaConf.currentPage = 1;
    memorabiliaConf.title = name
    this.props.dispatch({
      type: `${namespace}/changeMemorabiliaConf`,
      payload: memorabiliaConf,
    });
    this.props.dispatch({
      type: `${namespace}/fetchMemorabiliaList`,
    })
  }

  handleTableChange = pagination => {
    const { memorabiliaConf } = this.props[namespace];
    memorabiliaConf.currentPage = pagination.currentPage;
    memorabiliaConf.pageSize = pagination.pageSize;
    this.props.dispatch({
      type: `${namespace}/changeMemorabiliaConf`,
      payload: memorabiliaConf,
    });
    this.props.dispatch({
      type: `${namespace}/fetchMemorabiliaList`,
    })
  }

  onEdit = record => {
    this.setState({
      detailData: record,
      showItem: true
    })
  }

  toAdd = () => {
    this.setState({
      detailData: null,
      showItem: true
    })
  }

  onDelnews = id => {
    this.props.dispatch({
      type: `${namespace}/toDelmemorailia`,
      payload: id
    })
  }

  closeItem = () => {
    this.setState({
      showItem: false,
      detailData: null
    })
    this.props.dispatch({
      type: `${namespace}/fetchMemorabiliaList`,
    })
  }

  onDetail = record => {
    this.setState({
      detailData: record,
      showUnionItem: true
    })
  }

  closeUnionItem = () => {
    this.setState({
      showUnionItem: false,
      detailData: null
    })
  }

  onShare = id => {
    let data = {
      id,
      dingMsgTempType: '2502',
      type: 0,
      allianceId: localStorage.getItem("alliance")
    }
    this.props.dispatch({
      type: 'union/dingdingShare',
      payload: data
    }).then(rsp => {
      if(rsp && rsp.code === 0) {
        message.success("分享成功")
      }
    })
  }


  render() {
    const { memorabiliaList, memorabiliaTotal, memorabiliaConf } = this.props[namespace]
    const { detailData, showItem, showUnionItem } = this.state
    const { dataLoading } = this.props
    const columns = [
      { title: '序号', width: '80px', dataIndex: 'x', align: 'center', render: (text, record, index) => `${index + 1}` },
      {
        title: '标题',
        dataIndex: 'title',
        align: 'center',
        width: 300,
        onCell: () => ({
          style: {
            whiteSpace: 'nowrap',
            maxWidth: 300,
          },
        }),
        render: text => (
          <EllipsisTooltip title={text}>{text}</EllipsisTooltip>
        ),
      },
      { title: '事件时间', width: '200px', dataIndex: 'eventtime', align: 'center' },
      { title: '显示顺序', width: '100px', dataIndex: 'displayno', align: 'center' },
      {
        title: '操作',
        dataIndex: 'x',
        align: 'center',
        render: (text, record) => {
          return (
            <span>
               {
                localStorage.getItem('isPresident') == 1 &&
               <Popconfirm
                  title="确认要分享内容到本联盟群?"
                  onConfirm={() => { this.onShare(record.id) }}
                  okText="确认"
                  cancelText="取消"
                >
                <Button style={{marginRight: '10px'}}>分享</Button>
                </Popconfirm>
              }
              {localStorage.getItem('isPresident') == 1 ? 
              <Button type="primary" onClick={() => { this.onEdit(record) }}>编辑</Button>
             : <Button type="primary" onClick={() => { this.onDetail(record) }}>详情</Button>
              } 
              {
                localStorage.getItem('isPresident') == 1 &&
                <Popconfirm
                  title="确认要删除该联盟动态?"
                  onConfirm={() => { this.onDelnews(record.id) }}
                  okText="确认"
                  cancelText="取消"
                >
                <Button type="danger" style={{marginLeft: '10px'}}>删除</Button>
                </Popconfirm>
              }
            </span>
          )
        }
      }
    ]
    const pagination = {
      pageSize: memorabiliaConf.pageSize,
      total: memorabiliaTotal,
      showQuickJumper: true,
      current: memorabiliaConf.currentPage,
      showTotal: (total, range) => (
        <span>
          目前显示{range[0]}-{range[1]} 条,共 {total} 条
        </span>
      )
    }

    return (
      <div>
        {showItem ? <NewsItem detailData={detailData} closeItem={this.closeItem} />
          :
          <>
            {localStorage.getItem('isPresident') == 1 && <Button type="primary" style={{ margin: '10px' }} onClick={this.toAdd}>新增</Button>}
            <div className={style.searchBox}>
              <div className={style.searchItem}>
                <span className={style.label}>标题</span>
                <Input placeholder="请输入标题" allowClear onChange={this.onChangeName} style={{ width: '200px' }} />
              </div>
              <div className={style.searchItem}>
                <Button type="primary" onClick={this.toSearch}>查询</Button>
              </div>
            </div>
            <Table
              rowKey="id"
              columns={columns}
              dataSource={memorabiliaList}
              loading={dataLoading}
              pagination={pagination}
              onChange={this.handleTableChange}
            />
             {showUnionItem && <UnionItem detailData={detailData} boxTitle={'联盟动态'} closeBox={this.closeUnionItem}/>}
          </>
        }
      </div>
    )
  }
}

export default News

