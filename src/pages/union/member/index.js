import React, { Component } from 'react'
import { connect } from 'dva'
import { Button, Table, Input, Popconfirm, InputNumber, message } from 'antd'
import EllipsisTooltip from '@/components/ellipsisTooltip'
import EditOrgInfo from '../../../components/header/orgItem'
import { imgFormat } from '@/utils/utils'
import style from './index.scss'
import MemberItem from './item'

const namespace = 'member'

@connect(({ member, loading }) => ({ member, dataLoading: loading.effects[`${namespace}/fetchMemberList`] }))
class Member extends Component {
    state = {
      name: '',
      contact: '',
      showBox: false,
      showOrgInfo: false,
      orgId: null,
    }
    componentDidMount() {
      let searchConf = { 
        currentPage: 1,
        pageSize: 10,
        contact: '',
        name: '',
        alliance: localStorage.getItem('alliance')
      }
      this.props.dispatch({
        type: `${namespace}/changeMemberListConf`,
        payload: searchConf,
      })
        this.props.dispatch({
            type: `${namespace}/fetchMemberList`
        })
    }
    componentWillUnmount() {
      let searchConf = { 
        currentPage: 1,
        pageSize: 10,
        contact: '',
        name: '',
      }
      this.props.dispatch({
        type: `${namespace}/changeMemberListConf`,
        payload: searchConf,
      })
    } 

    onChangeName = e => {
      this.setState({
        name: e.target.value
      })
    }

    onChangeContact = e => {
      this.setState({
        contact: e.target.value
      })
    }
    
    toSearch = () => {
        const { memberListConf } = this.props[namespace];
        const { name, contact } = this.state
        memberListConf.currentPage = 1;
        memberListConf.name = name
        memberListConf.contact = contact
        this.props.dispatch({
          type: `${namespace}/changeMemberListConf`,
          payload: memberListConf,
        });
        this.props.dispatch({
          type: `${namespace}/fetchMemberList`,
        })
    }

    handleTableChange = pagination => {
        const { memberListConf } = this.props[namespace];
        memberListConf.currentPage = pagination.current;
        memberListConf.pageSize = pagination.pageSize;
        this.props.dispatch({
          type: `${namespace}/changeMemberListConf`,
          payload: memberListConf,
        });
        this.props.dispatch({
          type: `${namespace}/fetchMemberList`,
        })
    }

    onDelMember = id => {
      if(localStorage.getItem('isPresident') == 0) {
        message.error('对不起，你没有该权限')
        return
      }
      this.props.dispatch({
        type: `${namespace}/toDelMember`,
        payload: id
      })
    }


    toAdd = () => {
      if(localStorage.getItem('isPresident') == 0) {
        message.error('对不起，你没有该权限')
        return
      }
      this.setState({
        showBox: true
      })
    }
    
    closeBox = () => {
      this.setState({
        showBox: false
      })
    }

    changeDisplayno = (e, record) => {
      if(localStorage.getItem('isPresident') == 0) {
        return
      }
      let data = {
        alliance: record.alliance,
        id: record.id,
        displayno: e.target.value,
        orgid: record.orgid
      }
      this.props.dispatch({
        type: `${namespace}/saveAllianceOrg`,
        payload: data
      }).then(rsp => {
        if(rsp && rsp.code === 0) {
          message.success('操作成功！')
          this.props.dispatch({
            type: `${namespace}/fetchMemberList`
          })
        }
      })
    }

    toEditOrg = id => {
      this.setState({
        orgId: id,
        showOrgInfo: true
      })
    }

    closeOrgItem = () => {
      this.setState({
        showOrgInfo: false,
        orgId: null
      })
      this.props.dispatch({
        type: `${namespace}/fetchMemberList`,
      })
    }
  
     
    render() {
        const { memberList, memberListTotal, memberListConf } = this.props[namespace]
        const { showBox, showOrgInfo, orgId } = this.state
        const { dataLoading } = this.props
        const columns = [
            { title: '单位logo',
              dataIndex: 'logoPath',
              align: 'center',
              width: 150,
              render: text => {
                if(text) {
                  return <img src={imgFormat(text)} style={{width: '80px', height: '80px', borderRadius: '50%'}} alt={'单位logo'}/>
                }else {
                  return <img src={require('@/assets/org.png')} style={{width: '80px', height: '80px', borderRadius: '50%'}} alt={'单位logo'}/>
                }
              }
            },
            { title: '单位名称',
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
        { title: '联系人',width: '120px', dataIndex: 'contact', align: 'center'},
        { title: '联系方式',width: '150px', dataIndex: 'x2', align: 'center', 
         render: (text, record) => {
            return (
                <> 
                <div>{record.mobile}</div>
                <div>{record.email}</div>
                </>
            )
          } 
        },
        {
          title: '显示顺序',width: '120px', dataIndex: 'displayno', align: 'center',
          render: (text, record) => (
            <InputNumber disabled={localStorage.getItem('isPresident') == 0 ? true : false} min={0} style={{width: '120px'}} defaultValue={text} onBlur={e => {this.changeDisplayno(e, record)}} />
          )  
        },
        {
        title: '操作',
        dataIndex: 'x',
        align: 'center',
        render: (text, record) => {
            return (
                <span>
                   <Button type="primary" style={{marginRight: '10px'}} onClick={() => this.toEditOrg(record.orgid)}>编辑</Button>
                    <Popconfirm
                      title="确认要删除该联盟成员?"
                      onConfirm={() => {this.onDelMember(record.id)}}
                      okText="确认"
                      cancelText="取消"
                    > 
                      <Button type="danger">删除</Button>
                    </Popconfirm>
                </span>
            )
          }
         }
        ]  
        const columnsNo = [
          { title: '单位logo',
            dataIndex: 'logoPath',
            align: 'center',
            width: 150,
            render: text => {
              if(text) {
                return <img src={imgFormat(text)} style={{width: '80px', height: '80px', borderRadius: '50%'}} alt={'单位logo'}/>
              }else {
                return <img src={require('@/assets/org.png')} style={{width: '80px', height: '80px', borderRadius: '50%'}} alt={'单位logo'}/>
              }
            }
          },
          { title: '单位名称',
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
      { title: '联系人',width: '120px', dataIndex: 'contact', align: 'center'},
      { title: '联系方式',width: '150px', dataIndex: 'x2', align: 'center', 
       render: (text, record) => {
          return (
              <> 
              <div>{record.tel}</div>
              <div>{record.email}</div>
              </>
          )
        } 
      },
      {
        title: '显示顺序',width: '120px', dataIndex: 'displayno', align: 'center',
        render: (text, record) => (
          <InputNumber disabled={localStorage.getItem('isPresident') == 0 ? true : false} min={0} style={{width: '120px'}} defaultValue={text} onBlur={e => {this.changeDisplayno(e, record)}} />
        )  
      }
      ]  
        const pagination = {
            pageSize: memberListConf.pageSize,
            total: memberListTotal,
            showQuickJumper: true,
            current: memberListConf.currentPage,
            showTotal: (total, range) => (
              <span>
                目前显示{range[0]}-{range[1]} 条,共 {total} 条
              </span>
            )
        }

        return ( 
               <div>
                {localStorage.getItem('isPresident') == 1 && <Button type="primary" onClick={this.toAdd} style={{margin: '10px'}}>新增</Button>}  
                 <div className={style.searchBox}>
                    <div className={style.searchItem}>
                        <span className={style.label}>单位名称</span> 
                        <Input placeholder="请输入单位名称" onChange={this.onChangeName} style={{width: '200px'}}/>
                  </div>
                  <div className={style.searchItem}>
                        <span className={style.label}>联系人</span> 
                        <Input placeholder="请输入联系人" onChange={this.onChangeContact} style={{width: '200px'}}/>
                  </div>
                  <div className={style.searchItem}>
                    <Button type="primary" onClick={this.toSearch}>查询</Button>
                  </div>
                </div>
                  <Table
                      className="gobal-table"
                      rowKey="id"
                      columns={localStorage.getItem('isPresident') == 1 ? columns : columnsNo}
                      dataSource={memberList}
                      loading={dataLoading}
                      pagination={pagination}
                      onChange={this.handleTableChange}
                 />  
                {showBox && <MemberItem closeBox={this.closeBox} />}
                {showOrgInfo && <EditOrgInfo orgId={orgId} closeBox={this.closeOrgItem}/>}
              </div> 
        )
    }
}

export default Member

