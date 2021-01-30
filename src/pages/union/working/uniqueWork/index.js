import React, { Component } from 'react'
import { connect } from 'dva'
import { DatePicker, Select, Button, Pagination } from 'antd'
import UnionWorkList from '../../../components/workList'
import AddItem from './addItem'
import style from './index.scss'

const namespace = 'work'
const { Option } = Select
@connect(({ work, loading }) => ({ work, dataLoading: loading.effects[`${namespace}/fetchUnionWorkList`] }))
class UniqueWork extends Component {
    state = {
        year: '',
        month: '',
        type: null,
        showAdd: false,
        status: '',
    }
    componentDidMount() {
        this.props.dispatch({
            type: `${namespace}/fetchUnionWorkList`
        })
        this.props.dispatch({
            type: `${namespace}/fetchUnionTypeList`,
            payload: {category: 'WorkEventCategory'}
        })
    }
    onChangeDate = (date, dateString) => {
        this.setState({
            year: dateString.substring(0,4),
            month: dateString.substr(dateString.length-1, 1),
        })
    }
    changeType = value => {
        this.setState({
            type: value
        })
    }

    changeStatus = value => {
        this.setState({
            status: value
        })
    }

    onChangePage = page => {
        const { unionWorkConf } = this.props[namespace]
        unionWorkConf.currentPage = page
        this.props.dispatch({
            type: `${namespace}/changeUnionWorkConf`,
            payload: unionWorkConf
        })
        this.props.dispatch({
            type: `${namespace}/fetchUnionWorkList`
        })
    }

    toSearch = () => {
        const { year, month, type, status } = this.state
        const { unionWorkConf } = this.props[namespace]
        unionWorkConf.currentPage = 1
        unionWorkConf.year = year
        unionWorkConf.month = month
        unionWorkConf.category = type
        unionWorkConf.checkStatus = status
        this.props.dispatch({
            type: `${namespace}/changeUnionWorkConf`,
            payload: unionWorkConf
        })
        this.props.dispatch({
            type: `${namespace}/fetchUnionWorkList`
        })
    }

    closeBox = () => {
        this.setState({
            showAdd: false
        })
        this.props.dispatch({
            type: `${namespace}/fetchUnionWorkList`
        })
    }

    toAdd = () => {
        this.setState({
            showAdd: true
        })
    }

    render() {
        const { unionWorkTotal, unionWorkConf, unionWorkList, unionTypeList } = this.props[namespace]
        const { showAdd } = this.state
        const typeOptions = []
        if(unionTypeList.length > 0) {
            unionTypeList.forEach(item => {
                typeOptions.push(<Option key={item.id} value={item.id}>{item.name}</Option>)
            })
            typeOptions.unshift(<Option key={'0123'} value={''}>全部</Option>)
        }
        return (
            <div className={style.box}>
                <div className={style.filter}>
                <div className={style.add}>
                   {localStorage.getItem('isPresident') == 1 && <Button className={style.defaultBtn} onClick={this.toAdd}>添加新记录</Button>}
                 </div>
                 <div className={style.filterItem}>
                 <div className={style.label}>日期</div>
                  <DatePicker onChange={this.onChangeDate} picker="month"  placeholder="请选择日期" style={{marginRight: '30px'}}/> 
                  <div className={style.label}>分类</div>
                  <Select placeholder="请选择分类" style={{ width: 120, marginRight: '30px' }} onChange={this.changeType}>
                    {typeOptions}
                 </Select> 
                {localStorage.getItem('isPresident') == 1 && <><div className={style.label}>状态</div>
                  <Select placeholder="请选择状态" style={{ width: 120, marginRight: '30px' }} onChange={this.changeStatus}>
                     <Option value="">全部</Option>
                     <Option value="0">待审核</Option>
                     <Option value="1">审核通过</Option>
                     <Option value="2">审核驳回</Option>
                 </Select></> }
                 <div className={style.btn}>
                    <Button className={style.defaultBtn} onClick={this.toSearch}>查询</Button>
                  </div>
                 </div>
                </div>
               <UnionWorkList isImg={true} workList={unionWorkList} refreash={this.toSearch}/>
               {unionWorkList.length > 0 && <Pagination current={unionWorkConf.currentPage} pageSize={unionWorkConf.pageSize} onChange={this.onChangePage} total={unionWorkTotal} style={{textAlign: 'center'}}/>}

              {showAdd && <AddItem closeBox={this.closeBox} />} 
            </div>
        )
    }
}

export default UniqueWork