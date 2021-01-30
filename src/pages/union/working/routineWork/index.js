import React, { Component } from 'react'
import { connect } from 'dva'
import { DatePicker, Button, Modal, Input, message } from 'antd'
import TipsItem from './tipsItem'
import WorkList from '../../../components/workList'
import style from './index.scss'

const namespace = 'work'
const { TextArea } = Input
const monthTypeObj = {
    "PLAN": "saveOrUpdateJH",
    "SUMMARY": "saveOrUpdateZJ",
    "MEETING": "saveOrUpdateLH"
}
const yearTypeObj = {
    "PLAN": "saveOrUpdateYearJH",
    "SUMMARY": "saveOrUpdateYearZJ",
}
@connect(({ work, loading }) => ({ work, dataLoading: loading.effects[`${namespace}/fetchWorkList`] }))
class RoutineWork extends Component {
    state = {
        currentMonth: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        showInput: '',
        inputVal: '',
        inputTitle: '',
        tipsId: null,
        tipsType: null,
        type: 1, // 1 代表月， 2代表年
        typeList: [
            {id: 1, name: '月', isChecked: true},
            {id: 2, name: '年', isChecked: false},
        ],
        isChange: true,
        isPass: true,
        noPassCont: ''
    }
    componentDidMount() {
        this.props.dispatch({
            type: `${namespace}/fetchWorkList`
        })
        this.props.dispatch({
            type: `${namespace}/fetchTipsList`
        })
    }

    checkType = (item, index) => {
        const { typeList } = this.state
        let arr = typeList
        arr.map(item => item.isChecked = false)
        arr[index].isChecked = true
        this.setState({
            typeList: arr,
            type: item.id
        })
        const { workConf } = this.props[namespace]
        workConf.year = ''
        workConf.month = ''
        this.props.dispatch({
            type: `${namespace}/changeWorkConf`,
            payload: workConf
        })
        this.props.dispatch({
            type: `${namespace}/fetchWorkList`,
            payload: item.id
        })
        this.props.dispatch({
            type: `${namespace}/fetchTipsList`,
            payload: item.id
        })
    }

    onChangeDate = (date, dateString) => {
        this.setState({
            year: dateString.substring(0,4),
            month: dateString.substr(dateString.length-1, 1),
        })
    }

    onChangeYear = (date, dateString) => {
        this.setState({
            year: dateString
        })
    }
  
    toSearch = () => {
        const { year, month, type } = this.state
        const { workConf } = this.props[namespace]
        workConf.year = year
        if(type === 2) {
            workConf.month = ''
        }else {
            workConf.month = month   
        }
        this.props.dispatch({
            type: `${namespace}/changeWorkConf`,
            payload: workConf
        })
        this.props.dispatch({
            type: `${namespace}/fetchWorkList`,
            payload: type
        })
    }

    inputBox = () => {
        this.setState({
            showInput: true
        })  
    }

    closeInputBox = () => {
        this.setState({
            showInput: false,
            inputVal: ''
        })
    }

    onBack = item => {
        let title = item.month ? `${item.month}月月度${item.typeStr}` : `${item.year}年度${item.typeStr}`
        let tipTitle =  (item.status === 1 && item.description && item.checkStatus === 0) ? `${title}(待审核状态不能修改)` : `${title}`
        this.setState({
            inputTitle: tipTitle,
            tipsId: item.id,
            tipsType: item.type,
            inputVal: item.description,
            isChange: (item.status === 1 && item.description  && item.checkStatus === 0) ? false : true,
            isPass: (item.status === 1 && item.description  && item.checkStatus === 2) ? false : true,
            noPassCont: item.checkCont,
        })
    }

    changeInputVal = e => {
        this.setState({
            inputVal: e.target.value 
        })
    }

    saveTips = () => {
       const { inputVal, tipsId, tipsType, type } = this.state
        if(!inputVal) {
            message.error('填写内容不能为空')
            return
        }
        let data = {
            description: inputVal,
            id: tipsId,
            status: 0
        }
        let path = type === 1 ? monthTypeObj[tipsType] : yearTypeObj[tipsType]
        this.props.dispatch({
            type: `${namespace}/${path}`,
            payload: data
        }).then(rsp => {
            if(rsp && rsp.code === 0) {
                message.success('保存成功！')
                this.closeInputBox()
                this.props.dispatch({
                    type: `${namespace}/fetchTipsList`,
                    payload: type
                })
            }
        })
    }

    submitTips = () => {
        const { inputVal, tipsId, tipsType, type } = this.state
        if(!inputVal) {
            message.error('填写内容不能为空')
            return
        }
        let data = {
            description: inputVal,
            id: tipsId,
            status: 1
        }
        let path = type === 1 ? monthTypeObj[tipsType] : yearTypeObj[tipsType]
        this.props.dispatch({
            type: `${namespace}/${path}`,
            payload: data
        }).then(rsp => {
            if(rsp && rsp.code === 0) {
                message.success('提交成功！')
                this.closeInputBox()
                this.props.dispatch({
                    type: `${namespace}/fetchTipsList`,
                    payload: type
                })
            }
        })
    }

    render() {
        const { workList, tipsList } = this.props[namespace]
        const { showInput, inputTitle, inputVal, typeList, type, isChange, isPass, noPassCont } = this.state
        return (
            <div className={style.box}>
                <div className={style.changeType}>
                    {
                        typeList.map((item, index) => (
                        <div key={item.id} className={item.isChecked ? style.typeCheckedItem : style.typeItem} onClick={() => this.checkType(item, index)}>{item.name}</div>
                        ))
                    }
                </div>
                {localStorage.getItem('isPresident') == 1 && <TipsItem tipsList={tipsList} inputBox={this.inputBox} onBack={val => this.onBack(val)}/>}
                <div className={style.filter}>
                 {type === 1 && <><div className={style.label}>日期</div>
                  <DatePicker onChange={this.onChangeDate} picker="month"  placeholder="请选择日期" style={{marginRight: '30px'}}/></> }
                 {type === 2 && <><div className={style.label}>年份</div>
                  <DatePicker onChange={this.onChangeYear} picker="year"  placeholder="请选择年份" style={{marginRight: '30px'}}/></> }
                 <div className={style.btn}>
                    <Button className={style.defaultBtn} onClick={this.toSearch}>查询</Button>
                 </div>
                </div>
               <WorkList isImg={false} workList={workList}/>
                { showInput && 
                  <Modal
                    width={'800px'}
                    title={`填写${inputTitle}`}
                    visible={true}
                    footer={null}
                    onCancel={this.closeInputBox}
                    >
                    <div className={style.inputBox}>
                  {/* {!isPass && <div style={{marginBottom: '10px'}}>审核不通过原因: {noPassCont}</div>} */}
                    <TextArea
                        disabled={!isChange}
                        value={inputVal}
                        onChange={this.changeInputVal}
                        autoSize={{ minRows: 10, maxRows: 20 }}
                    />
                     {isChange  &&
                     <div className={style.options}>
                            <Button className={style.defaultBtn} onClick={this.saveTips}>保存</Button> 
                            <Button disabled={!isChange} type="primary" style={{marginLeft: '30px'}} onClick={this.submitTips}>提交</Button>
                    </div>
                    }
                    </div>
                 </Modal>
                }
            </div>
        )
    }
}

export default RoutineWork