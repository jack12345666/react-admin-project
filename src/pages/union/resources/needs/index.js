import React, { Component } from 'react'
import { connect } from 'dva'
import { Button, Table, Input, Popconfirm, Tag, Tooltip } from 'antd'
import EllipsisTooltip from '@/components/ellipsisTooltip'
import NeedsItem from './item'
import style from './index.scss'
import moment from 'moment'

const format = 'YYYY-MM-DD HH:mm'
const namespace = 'needs'
@connect(({ needs, loading }) => ({ needs, dataLoading: loading.effects[`${namespace}/fetchNeedsList`] }))
class Needs extends Component {
    state = {
        name: '',
        showItem: false,
        needsId: null,

    }
    componentDidMount() {
        this.props.dispatch({
            type: `${namespace}/fetchNeedsList`
        })     
    }

    onChangeName = e => {
        this.setState({
          name: e.target.value
        })
    }
    
  toSearch = () => {
    const { needsConf } = this.props[namespace];
    const { name } = this.state
    needsConf.currentPage = 1;
    needsConf.nameLike = name
    this.props.dispatch({
      type: `${namespace}/changeNeedsConf`,
      payload: needsConf,
    });
    this.props.dispatch({
      type: `${namespace}/fetchNeedsList`,
    })
  }

  handleTableChange = pagination => {
    const { needsConf } = this.props[namespace];
    needsConf.currentPage = pagination.currentPage;
    needsConf.pageSize = pagination.pageSize;
    this.props.dispatch({
      type: `${namespace}/changeNeedsConf`,
      payload: needsConf,
    });
    this.props.dispatch({
      type: `${namespace}/fetchNeedsList`,
    })
  }

  onEdit = record => {
    this.setState({
      needsId: record.id,
      showItem: true
    })
  }

  toAdd = () => {
    this.setState({
      needsId: null,
      showItem: true
    })
  }


  onDelNeeds = id => {
    this.props.dispatch({
      type: `${namespace}/delNeeds`,
      payload: id
    })
  }

  closeItem = () => {
    this.setState({
      showItem: false,
      needsId: null
    })
    this.props.dispatch({
      type: `${namespace}/fetchNeedsList`,
    })
  }

  onChangeState = record => {
     let state = null
     if(record.state === 0) {
       state = 1
     }else {
       state = 0
     }
     let data = {
      id: record.id,
      state
    }
    this.props.dispatch({
      type: `${namespace}/toChangeNeedState`,
      payload: data
   })
  }

 
    render() {
        const { needsList, needsListTotal, needsConf } = this.props[namespace]
        const { needsId, showItem } = this.state
        const { dataLoading } = this.props
        const columns = [
            { title: '编号',width: '180px', dataIndex: 'no', align: 'center' },
            { title: '采购名称',
              dataIndex: 'name',
              align: 'center',
              width: 180,
              onCell: () => ({
                  style: {
                    whiteSpace: 'nowrap',
                    maxWidth: 180,
                  },
                }),
              render: text => (
                <EllipsisTooltip title={text}>{text}</EllipsisTooltip>
              ),
            },
            { title: '求购内容',
            dataIndex: 'content',
            align: 'center',
            width: 200,
            onCell: () => ({
                style: {
                  whiteSpace: 'nowrap',
                  maxWidth: 200,
                },
              }),
            render: text => (
              <EllipsisTooltip title={text}>{text}</EllipsisTooltip>
            ),
          },
        { title: '上/下架',width: '120px', dataIndex: 'state', align: 'center', render: text => (text === 1 ? '上架' : '下架') },
        { title: '状态',width: '120px', dataIndex: 'status', align: 'center', render:(text, record) => {
          if(text === 0) {
            return <Tag color="#2db7f5">待审核</Tag>
          }else if(text === 1) {
            return <Tag color="success">审核通过</Tag>
          }else {
            return  <Tooltip placement="top" title={`原因：${record.checkComment}`}>
            <Tag color="error">审核驳回</Tag>
          </Tooltip>
          }
        } },
        { title: '采购时间',width: '180px', dataIndex: 'x1', align: 'center', 
         render: (text, record) => {
            return (
                <>
                <div>起&nbsp;{moment(record.expirybegindate).format(format)}</div>
                <div>止&nbsp;{moment(record.expiryenddate).format(format)}</div>
                </>
            )
          } 
        },
        { title: '公司名称',
        dataIndex: 'companyName',
        align: 'center',
        width: 150,
        onCell: () => ({
            style: {
              whiteSpace: 'nowrap',
              maxWidth: 150,
            },
          }),
        render: text => (
          <EllipsisTooltip title={text}>{text}</EllipsisTooltip>
        ),
      },
        { title: '联系方式',width: '150px', dataIndex: 'x2', align: 'center', 
         render: (text, record) => {
            return (
                <> 
                <div>{record.tel}</div>
                <div>{record.contact}</div>
                </>
            )
          } 
        },
        {
        title: '操作',
        dataIndex: 'x',
        align: 'center',
        width: 180,
        fixed: 'right',
        onCell: () => ({
            style: {
              whiteSpace: 'nowrap',
              minWidth: 180,
            },
          }),
        render: (text, record) => {
            return (
              <>
              <div>
                    <Button style={{marginRight: '10px'}} type="primary" disabled={record.status === 10 ? true : false} onClick={() => {this.onEdit(record)}}>编辑</Button>
                    {/* <Popconfirm
                      title="确认要删除该需求?"
                      onConfirm={() => {this.onDelNeeds(record.id)}}
                      okText="确认"
                      cancelText="取消"
                      disabled={record.status === 10 ? true : false}
                    > 
                      <Button type="danger" disabled={record.status === 10 ? true : false}>删除</Button>
                    </Popconfirm> */}
                    <Popconfirm
                      title={record.state === 0 ? '确认要上架该需求' : '确认要下架该需求'}
                      onConfirm={() => {this.onChangeState(record)}}
                      okText="确认"
                      cancelText="取消"
                    > 
                      <Button>{record.state === 0 ? '上架' : '下架'}</Button>
                    </Popconfirm>
                  
              </div>
            </>  
            )
          }
         }
        ]  
        const pagination = {
            pageSize: needsConf.pageSize,
            total: needsListTotal,
            showQuickJumper: true,
            current: needsConf.currentPage,
            showTotal: (total, range) => (
              <span>
                目前显示{range[0]}-{range[1]} 条,共 {total} 条
              </span>
            )
       }
        return (
            <div>
              {showItem ? <NeedsItem needsId={needsId} closeItem={this.closeItem}/>
                :
                <>
                  <Button type="primary" style={{ margin: '10px' }} onClick={this.toAdd}>新增</Button>
                    <div className={style.searchBox}>
                    <div className={style.searchItem}>
                        <span className={style.label}>需求名称</span>
                        <Input placeholder="请输入需求名称" allowClear onChange={this.onChangeName} style={{ width: '200px' }} />
                    </div>
                    <div className={style.searchItem}>
                        <Button type="primary" onClick={this.toSearch}>查询</Button>
                    </div>
                    </div>
                    <Table
                        rowKey="id"
                        style={{width: '925px'}}
                        scroll={{ x: 980 }}
                        columns={columns}
                        dataSource={needsList}
                        loading={dataLoading}
                        pagination={pagination}
                        onChange={this.handleTableChange}
                    /> 
                  </>
                }
            </div>
        )
    }
}

export default Needs