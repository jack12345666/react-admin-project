import React, { Component } from 'react'
import { connect } from 'dva'
import { Button, Table, Divider ,Select, Input, Popconfirm, Tag, Tooltip } from 'antd'
import EllipsisTooltip from '@/components/ellipsisTooltip'
import AddItem from './addItem'
import EditItem from './editItem'
import style from './index.scss'

const namespace = 'product'
const { Option } = Select
const { Search } = Input

@connect(({ product, loading }) => ({ product, dataLoading: loading.effects[`${namespace}/fetchProductList`] }))
class Product extends Component {
    state = {
        storeId: null,
        showAdd: false,
        showEdit: false,
        productId: null,
    }
    componentDidMount() {
      const { productConf } = this.props[namespace]
      productConf.isPromotion = 1
      productConf.storeid = localStorage.getItem('storeId')
      this.props.dispatch({
        type: `${namespace}/changeProductConf`,
        payload: productConf,
      });
        this.props.dispatch({
            type: `${namespace}/fetchProductList`
        })
    }

    componentWillMount() {
      const { productConf } = this.props[namespace]
      productConf.isPromotion = ''
      productConf.currentPage = 1
      this.props.dispatch({
        type: `${namespace}/changeProductConf`,
        payload: productConf,
      });
    }

    onCheckStatus = value => {
        const { productConf } = this.props[namespace];
        productConf.currentPage = 1;
        productConf.state = value
        this.props.dispatch({
          type: `${namespace}/changeProductConf`,
          payload: productConf,
        });
        this.props.dispatch({
          type: `${namespace}/fetchProductList`,
        })
    }

    searchName = value => {
        const { productConf } = this.props[namespace];
        productConf.currentPage = 1;
        productConf.name = value
        this.props.dispatch({
          type: `${namespace}/changeProductConf`,
          payload: productConf,
        });
        this.props.dispatch({
          type: `${namespace}/fetchProductList`,
        })
      }

      handleTableChange = pagination => {
        const { productConf } = this.props[namespace];
        productConf.currentPage = pagination.current;
        productConf.pageSize = pagination.pageSize;
        this.props.dispatch({
          type: `${namespace}/changeProductConf`,
          payload: productConf,
        });
        this.props.dispatch({
          type: `${namespace}/fetchProductList`,
        })
    }

    onChangeState = (record) => {
        let state  = ''
        if(record.state === 1) {
            state = 0
        }else {
            state = 1
        }
       let data = {
           id: record.id,
           state
       }
       this.props.dispatch({
           type: `${namespace}/changeProductState`,
           payload: data
       })
    }

    onEdit = record => {
        this.setState({
            productId: record.id,
            showAdd: false,
            showEdit: true 
        })
    }

    toAdd = () => {
        this.setState({
            showAdd: true,
            showEdit: false
        })
    }

    closeBox = () => {
        this.setState({
            showAdd: false,
            showEdit: false,
            productId: null
        })
        this.props.dispatch({
            type: `${namespace}/fetchProductList`
        })
    }

 
    render() {
        const { productList, productTotal, productConf } = this.props[namespace]
        const { showAdd, showEdit, productId } = this.state
        const { dataLoading } = this.props
        const pagination = {
            pageSize: productConf.pageSize,
            total: productTotal,
            showQuickJumper: true,
            current: productConf.currentPage,
            showTotal: (total, range) => (
              <span>
                目前显示{range[0]}-{range[1]} 条,共 {total} 条
              </span>
            )
        }
        const columns = [
            { title: '序号',
              width: 70,
              render:(text,record,index)=>`${index+1}`   
              },
              { title: '资源名称',
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
          { title: '资源价格',width: '120px', dataIndex: 'price', align: 'center',  
            render: (text, record) => {
              if(text === 0) {
                return '无'
              }else if(text === -1) {
                return '全场促销'
              }else {
                return text
              }
            } },
          { title: '促销价格',width: '120px', dataIndex: 'promotionprice', align: 'center',  
          render: (text, record) => {
            if(text === 0) {
              return '无'
            }else if(text === -1) {
              return '全场促销'
            }else {
              return text
            }
          } },
          { title: '资源状态',width: '120px', dataIndex: 'y', align: 'center', render: (text, record) => {
            if(record.state === 1) {
            if(record.auditStatus === 0 && record.audtiCheckStatus === 1) {
              return  <Tooltip placement="top" title={`原因：${record.auditComment}`}>
              <Tag color="error">审核驳回</Tag>
            </Tooltip>
            }else if(record.auditStatus === 1 && record.audtiCheckStatus === 1){
              return <Tag color="success">审核通过</Tag>
            }else {
              return <Tag color="#2db7f5">待审核</Tag>
            } 
          }else {
            return <span>下架</span>
          }
          }},
          { title: '添加时间',width: '150px', dataIndex: 'addtime', align: 'center'},
          {
          title: '操作',
          dataIndex: 'x',
          align: 'center',
          onCell: () => ({
              style: {
                whiteSpace: 'nowrap',
                maxWidth: 160,
              },
            }),
          render: (text, record) => {
              return (
                  <span className={style.box}>
                      <Button type="primary" disabled={(record.audtiCheckStatus === 0 || record.state === 0) ? true : false}  onClick={() => { this.onEdit(record) }}> 修改 </Button> 
                      {(record.state === 0 || record.state === 1)  && <Divider type="vertical" />}   
                      {
                        record.state === 0 &&
                        <Popconfirm
                        title="确认要上架该资源?"
                        onConfirm={() => { this.onChangeState(record)}}
                        okText="确认"
                        cancelText="取消"
                        disabled={(record.auditStatus === 0 || record.audtiCheckStatus === 0) ? true : false}
                      > 
                        <Button disabled={(record.auditStatus === 0 || record.audtiCheckStatus === 0) ? true : false} className={style.defaultBtn}>上架</Button>
                      </Popconfirm>
                      }      
                      {
                          record.state === 1 &&  
                          <Popconfirm
                          title="确认要下架该资源?"
                          onConfirm={() => { this.onChangeState(record)}}
                          okText="确认"
                          cancelText="取消"
                          disabled={(record.auditStatus === 0 || record.audtiCheckStatus === 0) ? true : false}
                        > 
                          <Button disabled={(record.auditStatus === 0 || record.audtiCheckStatus === 0) ? true : false} className={style.defaultBtn}>下架</Button>
                        </Popconfirm>
                      }
                  </span>
              )
            }
           }
          ]  
        return (
            <div>
                {
                    (showAdd || showEdit) ? (showAdd ? <AddItem closeBox={this.closeBox}/> : <EditItem productId={productId} closeBox={this.closeBox}/>)
                    :
                    <>
                    <Button type="primary" onClick={this.toAdd} style={{margin: '10px'}}>新增</Button>
                    <div style={{display: 'flex', alignContent: 'center', marginTop: '10px'}}>
                    <div style={{margin: '5px 15px 0 15px'}}>资源状态</div> 
                    <Select
                        style={{ width: 150, marginBottom: '20px'}}
                        placeholder="请选择资源状态"
                        onChange={this.onCheckStatus}>   
                        <Option value="">全部</Option>
                        <Option value="1">正常</Option>
                        <Option value="0">下架</Option>
                    </Select>
                    <Search
                        style={{width: '360px', marginLeft: '20px'}}
                        placeholder="请输入资源名称"
                        enterButton="搜索"
                        size="middle"
                        allowClear={true}
                        onSearch={value => this.searchName(value)}
                      />
                   </div>
                   <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={productList}
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

export default Product