import React, { Component } from 'react'
import { connect } from 'dva'
import { Button, Table, Select, Popconfirm, Tag, Tooltip } from 'antd'
import EllipsisTooltip from '@/components/ellipsisTooltip'
import EnrollList from '../../../components/enrollList' 
import moment from 'moment'

const namespace = 'activity'
const { Option } = Select
const format = 'YYYY-MM-DD HH:mm'

@connect(({ activity, loading }) => ({ activity, dataLoading: loading.effects[`${namespace}/fetchActivityList`] }))
class ActivityList extends Component {
    componentDidMount() {
        this.props.dispatch({
            type: `${namespace}/fetchActivityList`
        })
    }
    componentWillUnmount() {
      let searchConf = {
        currentPage: 1,
        pageSize: 10,
        status: '',
        alliance: localStorage.getItem('alliance'),
        companyId: localStorage.getItem('orgId')
      }
      this.props.dispatch({
        type: `${namespace}/changeActivityListConf`,
        payload: searchConf,
      });
    } 

    onSearchChange = value => {
        const { activityListConf } = this.props[namespace];
        activityListConf.currentPage = 1;
        activityListConf.status = value
        this.props.dispatch({
          type: `${namespace}/changeActivityListConf`,
          payload: activityListConf,
        });
        this.props.dispatch({
          type: `${namespace}/fetchActivityList`,
        })
    }

    handleTableChange = pagination => {
        const { activityListConf } = this.props[namespace];
        activityListConf.currentPage = pagination.current;
        activityListConf.pageSize = pagination.pageSize;
        this.props.dispatch({
          type: `${namespace}/changeActivityListConf`,
          payload: activityListConf,
        });
        this.props.dispatch({
          type: `${namespace}/fetchActivityList`,
        })
    }

    onEdit = (record) => {
        this.props.dispatch({
            type: `${namespace}/changeActivityDetail`,
            payload: record
        })
        this.props.history.push('/redUnion/editActivity/')
    }


    clickRow = record => {
    //    console.log(record)
    }

    onEnrollList = (record, e) => {
       e.stopPropagation();
       this.props.dispatch({
         type: `${namespace}/changeNeedAllow`,
         payload: record.needAllow
       })
       this.props.dispatch({
          type: `${namespace}/changeShowEnrollList`,
          payload: {
            showEnrollList: true,
            activityId: record.id
          }
      })
    }

    backPage = () => {
        this.props.dispatch({
            type: `${namespace}/changeShowEnrollList`,
            payload: {
              showEnrollList: false,
              activityId: null
            }
        })
    }

    onDelEnroll = record => {
        console.log(record.id)
        this.props.dispatch({
          type: `${namespace}/toDeleteActivity`,
          payload: record.id
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
       type: `${namespace}/toChangeActivityState`,
       payload: data
    })
   }

    render() {
        const { activityList, activityListTotal, activityListConf, activityId, showEnrollList } = this.props[namespace]
        const { dataLoading } = this.props
        const columns = [
            { title: '活动名称',
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
            { title: '主办方',
            dataIndex: 'sponsor',
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
        { title: '已报名(人)',width: '100px', dataIndex: 'curJoinAmount', align: 'center'},
        { title: '活动类型',width: '100px', dataIndex: 'category', align: 'center', render: text => (text === 1 ?  <Tag color="success">线上</Tag> : <Tag color="processing">线下</Tag>) },
        { title: '上/下架',width: '120px', dataIndex: 'state', align: 'center', render: text => (text === 1 ? '上架' : '下架') },
        { title: '审核状态',width: '100px', dataIndex: 'x3', align: 'center', render: (text, record) => {
          if(record.status === '10') {
            return  <Tag color="#cfcfcf">失效</Tag>
          }else if(record.status === '0') {
            return  <Tag color="#87d068">待审核</Tag>
          }else if(record.status === '1') {
            return <Tag color="#2db7f5">审核通过</Tag>
          }else{
            return  <Tooltip placement="top" title={record.checkComment}><Tag color="#f50">审核不通过</Tag></Tooltip>
          }
        }},
        { title: '活动时间',width: '180px', dataIndex: 'x1', align: 'center', 
         render: (text, record) => {
            return (
                <>
                <div>起&nbsp;{moment(record.begindate).format(format)}</div>
                <div>止&nbsp;{moment(record.enddate).format(format)}</div>
                </>
            )
          } 
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
        width: 255,
        fixed: 'right',
        onCell: () => ({
            style: {
              whiteSpace: 'nowrap',
              minWidth: 255,
            },
          }),
        render: (text, record) => {
            return (
              <>
              <div>
                    <Button style={{marginRight: '10px'}} type="primary" disabled={record.status === '10' ? true : false} onClick={() => {this.onEdit(record)}}>编辑</Button>
                    <Button style={{marginRight: '10px'}} disabled={record.status === '10' ? true : false} onClick={(e) => {this.onEnrollList(record, e)}}>报名列表</Button>
                    {/* <Popconfirm
                      title="确认要删除该活动?"
                      onConfirm={() => {this.onDelEnroll(record)}}
                      okText="确认"
                      cancelText="取消"
                      disabled={record.status === '10' ? true : false}
                    > 
                      <Button disabled={record.status === '10' ? true : false} type="danger">删除</Button>
                    </Popconfirm> */}
                    <Popconfirm
                      title={record.state === 0 ? '确认要上架该活动' : '确认要下架该活动'}
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
            pageSize: activityListConf.pageSize,
            total: activityListTotal,
            showQuickJumper: true,
            current: activityListConf.currentPage,
            showTotal: (total, range) => (
              <span>
                目前显示{range[0]}-{range[1]} 条,共 {total} 条
              </span>
            )
        }

        return (
             <div>
                 {
                  showEnrollList ? <EnrollList backPage={this.backPage} id={activityId}/>
                    : 
                  <div>
                 <span style={{marginRight: '15px'}}>活动状态</span> 
                  <Select
                      style={{ width: 150, margin: '10px 0 20px 0'}}
                      placeholder="请选择活动状态"
                      onChange={this.onSearchChange}
                  >   <Option value="">全部</Option>
                      <Option value="0">待审核</Option>
                      <Option value="1">审核通过</Option>
                      <Option value="2">审核不通过</Option>
                      <Option value="10">失效</Option>
                  </Select>
                  <Table
                      className="gobal-table"
                      style={{width: '925px'}}
                      rowKey="id"
                      scroll={{ x: 980 }}
                      columns={columns}
                      dataSource={activityList}
                      loading={dataLoading}
                      pagination={pagination}
                      onChange={this.handleTableChange}
                      onRow={(record) => { //表格行点击事件
                          return {
                            onClick: this.clickRow.bind(this,record)
                          }
                        }}
                 />  
                 </div>
                 }
            </div>  
        )
    }
}

export default ActivityList
