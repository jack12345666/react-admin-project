import React, { Component } from 'react'
import { connect } from 'dva'
import { Button, Table, Input, Select  } from 'antd'
import EllipsisTooltip from '@/components/ellipsisTooltip'
import AppealDetail from '../appealDetail'
import style from './index.scss'

const { Option } = Select
const namespace = "appeal"
@connect(({appeal, loading}) => ({appeal,dataLoading: loading.effects[`${namespace}/fetchAppealList`]}))
class AppealList extends Component {
    state = {
        name: '',
        showDetail: false,
        appealId: null,
        selectList:[
          {name:'全部',value:''},
          {name:'待受理',value:'2000'},
          {name:'已受理',value:'2001'},
          {name:'处理中',value:'2002'},
          {name:'已办结',value:'2003'},
          {name:'未解决',value:'2007'},
        ],
    }
    componentDidMount() {
        this.props.dispatch({
            type: `${namespace}/fetchAppealList`
        })
    }

    handleTableChange = pagination => {
        const { appealConf } = this.props[namespace];
        appealConf.currentPage = pagination.currentPage;
        appealConf.pageSize = pagination.pageSize;
        this.props.dispatch({
          type: `${namespace}/changeAppealConf`,
          payload: appealConf,
        });
        this.props.dispatch({
          type: `${namespace}/fetchAppealList`,
        })
    }

    onChangeName = e => {
        this.setState({
          name: e.target.value
        })
      }

    toSearch = () => {
        const { appealConf } = this.props[namespace];
        const { name } = this.state
        appealConf.currentPage = 1;
        appealConf.title = name
        this.props.dispatch({
          type: `${namespace}/changeAppealConf`,
          payload: appealConf,
        });
        this.props.dispatch({
          type: `${namespace}/fetchAppealList`,
        })
    }
    
    onDetail = id => {
        this.setState({
            showDetail: true,
            appealId: id
        })
    }

    goBack = () => {
        this.setState({
            showDetail: false,
            appealId: null
        })
        this.props.dispatch({
          type: `${namespace}/fetchAppealList`
      })
    }
    handleChange=(val)=>{
      const {appealConf} = this.props[namespace]    
      appealConf.currentPage = 1;
      appealConf.innerStatus = val
      this.props.dispatch({
        type:`${namespace}/changeAppealConf`,
        payload:appealConf,
      })
      this.props.dispatch({
        type: `${namespace}/fetchAppealList`,
      })
    }
    render() {
        const { appealList, appealListTotal, appealConf } = this.props[namespace]
        const { dataLoading } = this.props
        const { showDetail, appealId, selectList } = this.state
        const columns = [
            { title: '编号', width: '150px', dataIndex: 'no', align: 'center' },
            {
              title: '问题概况',
              dataIndex: 'title',
              align: 'center',
              width: 260,
              onCell: () => ({
                style: {
                  whiteSpace: 'nowrap',
                  maxWidth: 260,
                },
              }),
              render: text => (
                <EllipsisTooltip title={text}>{text}</EllipsisTooltip>
              ),
            },
            { title: '单位名称', width: '200px', dataIndex: 'orgName', align: 'center', 
             onCell: () => ({
                style: {
                  whiteSpace: 'nowrap',
                  maxWidth: 200,
                },
              }),
            render: text => (
                <EllipsisTooltip title={text}>{text}</EllipsisTooltip>
              ), },
            { 
              title: '问题分类', 
              width: '200px', 
              dataIndex: 'questionType', 
              align: 'center',
              render:(text,record)=>{
                return <div>{record.category === '0106' ? '党建类问题' : '业务类问题'} </div>
              } 
            },
            { title: '状态', width: '130px', dataIndex: 'innerStatusStr', align: 'center' },
            { title: '提交时间', width: '130px', dataIndex: 'createTime', align: 'center' },
            { title: '办结时间', width: '130px', dataIndex: 'resultTime', align: 'center' },
            {
              title: '操作',
              dataIndex: 'x',
              align: 'center',
              render: (text, record) => {
                return (
                    <Button type="link" onClick={() => this.onDetail(record.id)}>查看详情</Button>
                )
              }
            }
          ]
          const pagination = {
            pageSize: appealConf.pageSize,
            total: appealListTotal,
            showQuickJumper: true,
            current: appealConf.currentPage,
            showTotal: (total, range) => (
              <span>
                目前显示{range[0]}-{range[1]} 条,共 {total} 条
              </span>
            )
        }
        return (
            <div>
                {showDetail ? <AppealDetail appealId={appealId} goBack={this.goBack}/> :
                <>
                <div className={style.searchBox}>
                <div className={style.searchItem}>
                  问题状态：
                  <Select defaultValue="" style={{ width: 160 }} onChange={this.handleChange}>
                    {
                      selectList.map(item=>{
                        return <Option value={item.value} key={item.value}>{item.name} </Option>
                      })
                    }
                  </Select>
                </div>
                <div className={style.searchItem}>
                    {/* <span className={style.label}>问题概述</span> */}
                    <Input placeholder="请输入问题概述搜索" allowClear onChange={this.onChangeName} style={{ width: '300px' }} />
                </div>
                <div className={style.searchItem}>
                    <Button type="primary" onClick={this.toSearch}>查询</Button>
                </div>
                </div>
                <Table
                rowKey="id"
                columns={columns}
                dataSource={appealList}
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

export default AppealList