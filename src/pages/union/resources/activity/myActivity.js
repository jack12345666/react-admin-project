import React, { Component } from 'react'
import { connect } from 'dva'
import { Button, Table, Select, Tag } from 'antd'
import EllipsisTooltip from '@/components/ellipsisTooltip'
import EnrollDetail from '../../../components/entrollDetail'
import ActivityDetail from '../../../components/activityDetail'

const namespace = 'activity'
const { Option } = Select

@connect(({ activity, loading }) => ({ activity, dataLoading: loading.effects[`${namespace}/fetchMyActivity`] }))
class MyActivity extends Component {
    state = {
      showDetail: false,
      enrollId: null,
      showActivity: false,
      activityDetail: null
    }
    componentDidMount() {
        this.props.dispatch({
            type: `${namespace}/fetchMyActivity`
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
        type: `${namespace}/changeMyActivityConf`,
        payload: searchConf,
      })
    } 
    onSearchChange = value => {
        const { myActivityConf } = this.props[namespace];
        myActivityConf.currentPage = 1;
        myActivityConf.status = value
        this.props.dispatch({
          type: `${namespace}/changeMyActivityConf`,
          payload: myActivityConf,
        });
        this.props.dispatch({
          type: `${namespace}/fetchMyActivity`,
        })
    }
    handleTableChange = pagination => {
        const { myActivityConf } = this.props[namespace];
        myActivityConf.currentPage = pagination.current;
        myActivityConf.pageSize = pagination.pageSize;
        this.props.dispatch({
          type: `${namespace}/changeMyActivityConf`,
          payload: myActivityConf,
        });
        this.props.dispatch({
          type: `${namespace}/fetchMyActivity`,
        })
    }
    onDetail = (record) => {
        this.setState({
          enrollId: record.orderId,
          showDetail: true
        })
    }

    onActivityDetail = record => {
      this.setState({
        activityDetail: record,
        showActivity: true
      })
    }

    closeBox = () => {
      this.setState({
        showDetail: false,
        enrollId: null
      })
    }

    closeActivityDetail = () => {
      this.setState({
        showActivity: false,
        activityDetail: null
      })
    }
    render() {
        const { myActivityList, myActivityTotal, myActivityConf } = this.props[namespace]
        const { showDetail, enrollId, showActivity, activityDetail } = this.state
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
      { title: '活动类型',width: '100px', dataIndex: 'category', align: 'center', render: text => (text === 1 ?  <Tag color="success">线上</Tag> : <Tag color="processing">线下</Tag>) },
      { title: '审核状态', width: '100px', dataIndex: 'orderCheckStatusStr', align: 'center'},
      { title: '审核结果', width: '100px', dataIndex: 'orderStatusStr', align: 'center', render: text => (text || '-')},
      { title: '活动时间', width: '200px', dataIndex: 'x1', align: 'center', 
       render: (text, record) => {
          return (
              <>
              <div>起&nbsp;{record.begindate}</div>
              <div>止&nbsp;{record.enddate}</div>
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
      fixed: 'right',
      width: 220,
      onCell: () => ({
          style: {
            whiteSpace: 'nowrap',
            maxWidth: 220,
          },
        }),
      render: (text, record) => {
          return (
              <span>  
                  <Button type="primary" onClick={() => {this.onDetail(record)}} style={{marginRight: '10px'}}>报名详情</Button>
                  <Button type="primary" onClick={() => {this.onActivityDetail(record)}}>活动详情</Button>
              </span>
          )
        }
       }
      ]  
      const pagination = {
          pageSize: myActivityConf.pageSize,
          total: myActivityTotal,
          showQuickJumper: true,
          current: myActivityConf.currentPage,
          showTotal: (total, range) => (
            <span>
              目前显示{range[0]}-{range[1]} 条,共 {total} 条
            </span>
          )
      }
      return (
             <div>
               <span style={{marginRight: '15px'}}>审核状态</span> 
                <Select
                    style={{ width: 150, margin: '10px 0 20px 0'}}
                    placeholder="请选择审核状态"
                    onChange={this.onSearchChange}
                >   <Option value="">全部</Option>
                    <Option value="0">待审核</Option>
                    <Option value="1">审核通过</Option>
                    <Option value="2">审核不通过</Option>
                    <Option value="10">失效</Option>
                </Select>
                <Table
                    className="gobal-table"
                    rowKey="id"
                    style={{width: '925px'}}
                    scroll={{ x: 980 }}
                    columns={columns}
                    dataSource={myActivityList}
                    loading={dataLoading}
                    pagination={pagination}
                    onChange={this.handleTableChange}
               /> 

                {showDetail && <EnrollDetail closeBox={this.closeBox} enrollId={enrollId} />}   
                {showActivity && <ActivityDetail data={activityDetail} closeBox={this.closeActivityDetail}/>}
            </div>  
        )
    }
}

export default MyActivity
