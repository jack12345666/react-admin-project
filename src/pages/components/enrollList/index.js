import React, { Component } from 'react'
import { connect } from 'dva'
import { Button, Table, Select, Tag } from 'antd'
import { ArrowLeftOutlined, DownloadOutlined  } from '@ant-design/icons';
import EllipsisTooltip from '@/components/ellipsisTooltip'
import EnrollDetail from './item' 
import { excelDownLoad } from '@/utils/utils'

const namespace = 'activity'
const { Option } = Select

@connect(({ activity, loading }) => ({ activity, dataLoading: loading.effects[`${namespace}/fetchEnrollList`] }))
class EnrollList extends Component {
    state = {
        showMemberList: false,
        isShowCheck: false,
        activityId: null
    }

    componentDidMount() {
        const { activityId } = this.props[namespace]
        let searchConf = {
          currentPage: 1,
          pageSize: 10,
          checkStatus: '',
          activityId
        }
        this.props.dispatch({
          type: `${namespace}/changeEnrollListConf`,
          payload: searchConf,
        });
        this.props.dispatch({
            type: `${namespace}/fetchEnrollList`
        })
    }

    componentWillUnmount() {
      let searchConf = {
        currentPage: 1,
        pageSize: 10,
        checkStatus: '',
        activityId: null,
      }
      this.props.dispatch({
        type: `${namespace}/changeEnrollListConf`,
        payload: searchConf,
      });
    } 

    onSearchChange = value => {
        const { enrollListConf } = this.props[namespace];
        enrollListConf.currentPage = 1;
        enrollListConf.checkStatus = value
        this.props.dispatch({
          type: `${namespace}/changeEnrollListConf`,
          payload: enrollListConf,
        });
        this.props.dispatch({
          type: `${namespace}/fetchEnrollList`,
        })
    }

    handleTableChange = pagination => {
        const { enrollListConf } = this.props[namespace];
        enrollListConf.currentPage = pagination.current;
        enrollListConf.pageSize = pagination.pageSize;
        this.props.dispatch({
          type: `${namespace}/changeEnrollListConf`,
          payload: enrollListConf,
        });
        this.props.dispatch({
          type: `${namespace}/fetchEnrollList`,
        })  
    }

    onMemberList = (record, e) => {
        e.stopPropagation();
        this.setState({
            showMemberList: true
        })
    }

    onDetail = record => {
        this.setState({
            activityId: record.id,
        })
        this.props.dispatch({
            type: `${namespace}/changeEnrollCheck`,
            payload: true
        })
    }

    closeBox = () => {
      this.setState({
        activityId: null
      })
        this.props.dispatch({
            type: `${namespace}/changeEnrollCheck`,
            payload: false
        })
    }

    toExport = () => {
      const { activityId } = this.props[namespace]
      excelDownLoad(activityId)
    }

    render() {
        const { enrollList, enrollListTotal, enrollListConf, showEnrollCheck } = this.props[namespace]
        const { dataLoading, backPage } = this.props
        const { activityId } = this.state
        const columns = [
            // { title: '活动编号', dataIndex: 'no', align: 'center', width: 150 },
            { title: '活动名称',
              dataIndex: 'activityName',
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
            { title: '所属联盟',
             dataIndex: 'userAllianceName',
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
             )
           },  
             { title: '公司名称',
             dataIndex: 'userCompanyName',
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
            { title: '申请人',width: '170px', dataIndex: 'x1', align: 'center', 
            render: (text, record) => {
                return (
                    <>
                    <div>{record.userName}</div>
                    <div>{record.userPhone}</div>
                    </>
                )
             } 
            },
            { title: '审核状态',width: '120px', dataIndex: 'checkStatus', align: 'center', render: text =>  (text === 1 ? '已审核' : '未审核')},
            { title: '审核结果',width: '120px', dataIndex: 'status', align: 'center', render: text => 
              { 
                if(text === 1) {
                    return <Tag color="#2db7f5">审核通过</Tag>
                }else if(text === 2) {
                    return <Tag color="#f50">审核不通过</Tag>
                }else {
                    return '暂无审核'
                }
             }
            },
            { title: '补充信息',
              dataIndex: 'userDesc',
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
            {
            title: '操作',
            dataIndex: 'x',
            align: 'center',
            width: 180,
            fixed: 'right',
            onCell: () => ({
                style: {
                whiteSpace: 'nowrap',
                maxWidth: 180,
                },
            }),
            render: (text, record) => {
                return (
                    <span>
                        <Button type="primary" onClick={() => {this.onDetail(record)}}>查看</Button>
                    </span>
                )
             }
           }
        ]  
        const pagination = {
            pageSize: enrollListConf.pageSize,
            total: enrollListTotal,
            showQuickJumper: true,
            current: enrollListConf.currentPage,
            showTotal: (total, range) => (
              <span>
                目前显示{range[0]}-{range[1]} 条,共 {total} 条
              </span>
            )
        }
        return (
             <div>
                  <div style={{marginBottom: '10px'}}>
                   <ArrowLeftOutlined style={{fontSize: '20px'}} onClick={backPage}/><span onClick={backPage} style={{marginLeft: '5px',fontSize: '16px',cursor: 'pointer'}}>返回</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                 <div>
                 <span style={{marginRight: '15px'}}>审核状态</span> 
                  <Select
                      style={{ width: 150, marginBottom: '20px'}}
                      placeholder="请选择审核状态"
                      onChange={this.onSearchChange}
                  >   <Option value="">全部</Option>
                      <Option value="0">待审核</Option>
                      <Option value="1">已审核</Option>
                  </Select>
                  </div>
                  {enrollList.length > 0 && <Button style={{margin: '0 20px 10px 0'}} type="primary" icon={<DownloadOutlined />} onClick={this.toExport}>导出报名列表</Button>}
               </div>
                  <Table
                      rowKey="id"
                      style={{width: '925px'}}
                      scroll={{ x: 1000 }}
                      columns={columns}
                      dataSource={enrollList}
                      loading={dataLoading}
                      pagination={pagination}
                      onChange={this.handleTableChange}
                 />   
              {showEnrollCheck && <EnrollDetail closeBox={this.closeBox} activityId={activityId} />} 
            </div>  
        )
    }
}

export default EnrollList
