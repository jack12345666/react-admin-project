import React, { Component } from 'react'
import { connect } from 'dva'
import UploadFile from '@/components/uploadFile'
import { BASEURL } from '@/utils/config'
import moment from 'moment'
import { Button, Row, Col, Input,  DatePicker, Divider, Card, message, InputNumber } from 'antd'
import style from './index.scss'

const namespace = 'needs'
const dateFormat = 'YYYY-MM-DD HH:mm:ss'
const { RangePicker } = DatePicker
const { TextArea } = Input
@connect(({ needs }) => ({ needs }))
class NeedsItem extends Component {
    state = {
        fileList: [],
        filePath: [],
        delFileIds: [],
        id: null,
        name: '',
        amount: null,
        companyId: null,
        companyName: '',
        contact: '',
        content: '',
        expirybegindate: undefined,
        expiryenddate: undefined,
        tel: '',
        budgetPrice: null,
        alliance: null,
        comment: '',
        time: undefined,
        auditType: 0,
        status: null,
        showPhoneTips: false
    }
    componentDidMount() {
        this.setState({
            companyId: localStorage.getItem('orgId'), 
            companyName: localStorage.getItem('orgName')
        })
        const { needsId } = this.props
        if(needsId) {
           this.props.dispatch({
               type: `${namespace}/fetchNeedsDetail`,
               payload: needsId
           }).then(() => {
               const { needsDetail } = this.props[namespace]
                const {id, name, comment, budgetPrice, contact, content, expirybegindate, expiryenddate, tel,amount,status } = needsDetail
                    this.setState({
                    id, name,comment, budgetPrice, contact, content, expirybegindate, expiryenddate, tel,amount,status
                }) 
             if(needsDetail.files.length > 0) {
               let arr = []
               needsDetail.files.forEach((item,index) => {
                   arr.push({
                       uid: Math.random().toString().slice(-6) + index,
                       id: item.id,
                       name: `附件${index+1}`,
                       url: BASEURL + item.filepath
                   })
               })
               this.setState({
                fileList: arr
               })
             }
           })
        }
    }

    changeName = ({ target: { value } }) => {
        this.setState({ 
            name: value
         })
    }

    changeContact =  ({ target: { value } }) => {
        this.setState({ 
            contact: value
         })
    }

    changeAmount = value => {
        this.setState({
            amount: value
        })
    }

    changePrice = value => {
        this.setState({
            budgetPrice: value
        })
    }

    changeTel = value => { 
      if(!(/^1[3456789]\d{9}$/.test(value))){ 
            this.setState({
                showPhoneTips: true
            })
        }else {
            this.setState({
                showPhoneTips: false
            })
        }
        this.setState({
            tel: value
        })
    }

    changeContent = ({ target: { value } }) => {
        this.setState({ 
            content: value
         })
    }

    changeComment = ({ target: { value } }) => {
        this.setState({ 
            comment: value
         })
    }

    uploadFile = (fileList, delFileList, curentList) => {
        let fileArr = []
        let delFileArr = []
        if(curentList.length > 0) {
            curentList.forEach(item => {
                fileArr.push(item.url)  
            })
        }
        if(delFileList.length > 0) {
            delFileList.forEach(item => {
                delFileArr.push(item.id)
            })
        }
        this.setState({
            filePath: fileArr,
            delFileIds: delFileArr
        })
    }

    onChangeTime = (date, dateString) => {
       this.setState({
        expirybegindate: dateString[0],
        expiryenddate: dateString[1]
       })
    }

    submitContent = () => {
        const {id, name, amount, contact, content, budgetPrice, expirybegindate, expiryenddate, tel, comment, filePath, delFileIds, companyId, companyName, auditType  } = this.state
        const { closeItem } = this.props
        if(!name) {
            message.error('请填写采购名称')
        }else if(!amount) {
            message.error('请填写采购数量')
        }else if(budgetPrice !== 0 && !budgetPrice) {
            message.error('请填写预算金额')
        }else if(!expirybegindate) {
            message.error('请选择采购时间')
        }else if(!contact) {
            message.error('请填写联系人')
        }else if(!content) {
            message.error('请填写求购内容')
        }else if(!(/^1[3456789]\d{9}$/.test(tel))){ 
            message.error("手机号码有误，请重填") 
        } else {
            let data = {
                id: id || '',
                name,
                amount,
                contact,
                tel,
                budgetPrice,
                content,
                expirybegindate,
                expiryenddate,
                comment,
                filepaths: filePath,
                delFileids: delFileIds,
                companyId,
                companyName,
                auditType,
                alliance: localStorage.getItem('alliance')
            }
            this.props.dispatch({
                type: `${namespace}/saveNeeds`,
                payload: data
            }).then(rsp => {
                if(rsp && rsp.code === 0) {
                    message.success('操作成功!')
                    closeItem()
                }
            })
        }
    }

    render() {
        const { closeItem, needsId } = this.props
        const { name, amount, contact,  content, budgetPrice, expirybegindate, expiryenddate, tel, comment, fileList, status, showPhoneTips } = this.state
        return (
            <Card title={needsId ? (status === 0 ? '编辑需求(需求待审核不能进行编辑)' : '编辑需求') : '新增需求'} bordered={false} style={{ width: '100%' }}>
            <Row>
                <Col span={24}>
                    <div className={style.item}>
                        <div className={style.label}>采购名称</div>
                        <div className={style.value}>
                           <Input disabled={status === 0 ? true : false} value={name} placeholder="请输入采购名称" onChange={this.changeName}/>
                        </div>
                    </div>
                </Col>
                <Col span={12}>
                    <div className={style.item}>
                        <div className={style.label}>采购数量</div>
                        <div className={style.value}>
                           <InputNumber  disabled={status === 0 ? true : false} style={{width: '300px'}} placeholder="请填写采购数量" min={1} max={9999999999} value={amount} onChange={this.changeAmount} />
                        </div>
                    </div>
                    </Col>
                    <Col span={12}>
                    <div className={style.item}>
                        <div className={style.label}>预算金额</div>
                        <div className={style.value}>
                           <InputNumber  disabled={status === 0 ? true : false} style={{width: '360px'}} placeholder="请填写预算金额" min={0} max={9999999999} value={budgetPrice} onChange={this.changePrice} />
                        </div>
                    </div>  
                  </Col>
                  <Col span={24}>
                    <div className={style.item}>
                        <div className={style.label}>采购时间</div>
                        <div className={style.value}>
                        {expirybegindate ?
                         <RangePicker  disabled={status === 0 ? true : false} showTime style={{width: '360px'}} value={[moment(expirybegindate, dateFormat), moment(expiryenddate, dateFormat)]}   format={dateFormat} onChange={this.onChangeTime} />
                         :
                         <RangePicker  showTime  style={{width: '360px'}} onChange={this.onChangeTime} />
                        }    
                        </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className={style.item}>
                        <div className={style.label}>联系人</div>
                        <div className={style.value}>
                           <Input  disabled={status === 0 ? true : false} value={contact} style={{width: '300px'}} placeholder="请填写联系人" onChange={this.changeContact}/>
                        </div>
                    </div>
                    </Col>
                    <Col span={12}>
                    <div className={style.item}>
                        <div className={style.label}>手机号</div>
                        <div className={style.value}>
                           <InputNumber disabled={status === 0 ? true : false} min={0} style={{width: '360px'}} value={tel} placeholder="请填写手机号" onChange={this.changeTel} />
                        </div>
                    </div>
                    {showPhoneTips && <div style={{position: 'absolute', top: '45px', left: '80px', color: 'red'}}>手机号格式不正确</div>}
                  </Col>
                  <Col span={24}>
                    <div className={style.sitem}>
                        <div className={style.label}>求购内容</div>
                        <div className={style.value}>
                        <TextArea
                            onChange={this.changeContent}
                            value={content}
                            disabled={status === 0 ? true : false}
                            placeholder="请填写求购内容"
                            autoSize={{ minRows: 2, maxRows: 3 }}
                        />
                        </div>
                    </div>
                    <div className={style.sitem}>
                        <div className={style.labels}>备注</div>
                        <div className={style.value}>
                        <TextArea
                            onChange={this.changeComment}
                            value={comment}
                            disabled={status === 0 ? true : false}
                            placeholder="请填写备注"
                            autoSize={{ minRows: 2, maxRows: 3 }}
                        />
                        </div>
                    </div>
                    <div className={style.sitem}>
                        <div className={style.labels}>附件</div>
                        <div className={style.value}>
                            <UploadFile fileList={fileList} fn={this.uploadFile}/>
                        </div>
                    </div>
                    <div className={style.btns}>
                        <Button type="primary" onClick={this.submitContent}  disabled={status === 0 ? true : false}>确定</Button><Divider type="vertical" />
                        <Button className={style.defaultBtn} onClick={closeItem}>取消</Button>
                    </div>
               </Col>
            </Row>
         </Card>
        )
    }
}

export default NeedsItem