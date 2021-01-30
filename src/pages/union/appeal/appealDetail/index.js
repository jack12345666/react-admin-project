import React, { Component } from 'react'
import { connect } from 'dva'
import { Button, Timeline, Tag, Input, message, Modal  } from 'antd'
import { SmileOutlined } from '@ant-design/icons';
import style from './index.scss'


const namespace = 'appeal'
const { TextArea } = Input
@connect(({ appeal }) => ({ appeal }))
class AppealDetail extends Component {
    state = {
        value: '',
        showAudit: false,
        remark:'',
        type:1,
        modalTitle:''
    }
    componentDidMount(){
        if(this.props.appealId) {
            this.props.dispatch({
            type: `${namespace}/fetchAppealDetail`,
            payload: this.props.appealId
         })
        }
    }
    onChange = ({ target: { value } }) => {
        this.setState({ value })
    }
    accept = ()=>{
        const { appealDetail } = this.props[namespace]
        this.props.dispatch({
            type:`${namespace}/fetchAcceptAppeal`,
            payload: appealDetail.id
        }).then(rsp=>{
            if(rsp && rsp.code === 0){
                message.success('受理成功!')
                this.props.dispatch({
                    type: `${namespace}/fetchAppealDetail`,
                    payload: this.props.appealId
                })
            }
        })

    }
    commucation=()=>{
        const { appealDetail } = this.props[namespace]
        let data = {
            questionId: appealDetail.id,
            description: this.state.value
        }
        this.props.dispatch({
            type:`${namespace}/appendCommucation`,
            payload: data
        }).then(rsp => {
            if(rsp && rsp.code === 0) {
                message.success("回复成功!")
                this.setState({
                    value: ''
                })
                this.props.dispatch({
                    type: `${namespace}/fetchAppealDetail`,
                    payload: this.props.appealId
                 })
            }
        })
    }
    completed = () => {
        this.setState({
            showAudit: true,
            type:1,
            modalTitle:'问题办结'
        })   
    }
    unCompleted = () => {     
        this.setState({
            showAudit: true,
            type:0,
            modalTitle:'问题未解决'
        })   
    }
    auditAppeal =()=>{
        const { appealDetail } = this.props[namespace]
        const {type, remark} = this.state
        if(!remark){
            message.error('请填写问题办理结果')
            return
        }
        let data = {
            questionId: appealDetail.id,
            resultType: type,
            result: remark
        }
        this.props.dispatch({
            type:`${namespace}/concludeAppeal`,
            payload:data
        }).then(rsp=>{
            if(rsp && rsp.code === 0){
                message.success('操作成功')
                this.props.dispatch({
                    type: `${namespace}/fetchAppealDetail`,
                    payload: this.props.appealId
                 })
                 this.setState({
                     showAudit:false
                 })
            }
        })
    }
    closeAudit=()=>{
        this.setState({
            showAudit: false,
            remark:''
        })
    }
    changeRemark = ({ target: { value } }) => {
        this.setState({
            remark: value
        })
    }

    render() {
        const { goBack } = this.props
        const { appealDetail } = this.props[namespace]
        const { value, showAudit, remark } = this.state
        return (
         <div>
             {
                 appealDetail &&  <div>
                 <div className={style.nav}>
                     <Button type="link" style={{marginRight: '-10px'}} onClick={goBack}>返回</Button> <span style={{paddingRight: '5px'}}>&gt;</span>
                     <span className={style.title}>问题详情</span>
                 </div>
                 <div className={style.status}>
                     <div className={style.label}>问题状态</div>
                     <div className={appealDetail.innerStatusStr==='已办结' ? style.value : style.rvalue}>{appealDetail.innerStatusStr} </div>
                     <div className={style.label} style={{marginLeft: 20}}>问题分类</div>
                     <div className={appealDetail.category==='0106' ? style.rvalue : style.value}>
                        {appealDetail.category ==='0106'?'党建类问题':'业务类问题'} 
                    </div>
                 </div>
                 <div className={style.grid}>
                     <div className={style.label1}>问题编号:</div>
                     <div className={style.value1}>{appealDetail.no} </div>
                     <div className={style.label1}>问题类型:</div>
                     <div className={style.value1}>{appealDetail.categoryName} </div>
                 </div>
                 <div className={style.grid}>
                     <div className={style.label}>联盟主席:</div>
                     <div className={style.value}>{localStorage.getItem('userName')} </div>
                     <div className={style.label}>单位名称:</div>
                     <div className={style.value}>{appealDetail.orgName} </div>
                 </div>
                 <div className={style.grid}>
                     <div className={style.label}>联盟名称:</div>
                     <div className={style.value}>{appealDetail.allianceName} </div>
                     <div className={style.label}>机构联系人:</div>
                     <div className={style.value}>{appealDetail.orgContactName}({appealDetail.orgContactMobile})</div>
                 </div>
 
                 <div className={style.content}>
                     <div className={style.title}>{appealDetail.title} </div>
                     <div className={style.time}>提交时间: {appealDetail.createTime} </div>
                     <div className={style.item}>
                         <div className={style.label}>问题描述</div>
                         <div className={style.value}>
                             {appealDetail.description}
                         </div>
                     </div>
                     {/* <div className={style.item}>
                         <div className={style.label}>问题详情</div>
                         <div className={style.value}>
                             湖南省经济和信息化委员会关于通过法定途径分类处理信访投诉请求工作的实施意见
                             湖南省经济和信息化委员会关于通过法定途径分类处理信访投诉请求工作的实施意见
                             湖南省经济和信息化委员会关于通过法定途径分类处理信访投诉请求工作的实施意见
                         </div>
                     </div> */}
                 </div>
 
                 <div className={style.timeLine}>
                 <div className={style.title}>跟进记录:</div>
                 <Timeline>
                    {
                        appealDetail.posts.length > 0 && appealDetail.posts.map(item =>(
                            <Timeline.Item key={item.id} dot={<SmileOutlined style={{ color: '#6FCF97'}} />}>
                            {
                               item.identity === '用户' && (
                                <Tag color="#57A6EB">{item.identity} </Tag>
                               ) 
                            }
                            {
                               item.identity === '委员会' && (
                                <Tag color="#6FCF97">{item.identity} </Tag>
                               ) 
                            }
                            {
                               item.identity === '联盟主席' && (
                                <Tag color="#F2994A">{item.identity} </Tag>
                               ) 
                            }
                            <span className={style.text}>来自:&nbsp;{item.orgUserName} </span>
                            <span className={style.time}>{item.createTime}</span>
                            <div className={style.info}>
                                {item.description}
                            </div>
                            </Timeline.Item>
                        ))
                    }
                     {/* <Timeline.Item dot={<SmileOutlined style={{ color: '#6FCF97'}} />}>
                       <Tag color="#57A6EB">用户</Tag>
                       <span className={style.text}>来自:&nbsp;杨阳</span>
                       <span className={style.time}>10-10 16:57</span>
                     </Timeline.Item>
                     <Timeline.Item dot={<SmileOutlined style={{ color: '#6FCF97'}} />}>
                       <Tag color="#6FCF97">单位单位</Tag> 
                      <span className={style.text}>来自:&nbsp;杨阳</span>
                       <span className={style.time}>10-10 16:57</span>
                       <div className={style.info}>
                        湖南省经济和信息化委员会关于通过法定途。 
                       </div>
                     </Timeline.Item>
                     <Timeline.Item dot={<SmileOutlined style={{ color: '#6FCF97'}} />}>
                      <Tag color="#EB5757">联盟主席</Tag> 
                      <span className={style.text}>来自:&nbsp;杨阳</span>
                      <span className={style.time}>10-10 16:57</span>
                     </Timeline.Item> */}
                 </Timeline>
                 </div>
                {
                    (appealDetail.innerStatus === '2001' || appealDetail.innerStatus === '2002' || appealDetail.innerStatus === '2007') && <>
                    <div className={style.reply}>
                        <TextArea
                            value={value}
                            onChange={this.onChange}
                            placeholder="请输入回复内容"
                            autoSize={{ minRows: 5, maxRows: 10 }}
                            className={style.textArea}
                            />
                            <div className={style.subtn}>
                                <Button type="primary" disabled={!value ? true : false} onClick={this.commucation}>回复</Button>
                            </div>
                        </div>
                        <div className={style.btns}>
                            <Button type="primary" onClick={this.unCompleted}>未解决</Button>
                            <Button  className={style.complated} onClick={this.completed}>已解决</Button>
                        </div>

                    </>
                }
                {
                   appealDetail.innerStatus === '2000' &&  
                   <div className={style.btns}>
                        <Button  className={style.complated} onClick={this.accept}>受理问题</Button>
                    </div>
                }
                {showAudit &&
                    <Modal
                        title={this.state.modalTitle}
                        visible={true}
                        onOk={this.auditAppeal}
                        onCancel={this.closeAudit}
                    >
                        <div className={style.auditBox}>                                                 
                            <div className={style.value}>
                                <TextArea
                                    onChange={this.changeRemark}
                                    value={remark}
                                    placeholder="请填写问题办理结果"
                                    autoSize={{ minRows: 2, maxRows: 3 }}
                                />
                            </div>                             
                        </div>
                    </Modal>}
                 
 
             </div>
             }
         </div>
        )
    }
}

export default AppealDetail