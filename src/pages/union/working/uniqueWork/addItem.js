import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, DatePicker, Select, Input, Button, message, Radio } from 'antd'
import MyUpload from '@/components/uploadImg'
import { imgFormat } from '@/utils/utils'
import style from './index.scss'
import moment from 'moment'

const { Option } = Select
const { TextArea } = Input
const { RangePicker } = DatePicker
const namespace = 'work'
const monthFormat = 'YYYY-MM'

@connect(({work}) => ({work}))
class AddItem extends Component {
    state = {
       type: '',
       year: new Date().getFullYear(),
       month: new Date().getMonth() + 1,
       imgUrl: '',
       img: '',
       content: '',
       title: '',
       eventBeginTime: '',
       eventEndTime: '',
       visitOrgName: '',
       visitOrgContent: '',
       channels: '' ,
       channelsType: null,
       gotoUrl: null,
       defaultDate: moment(`${new Date().getFullYear()}-${new Date().getMonth() + 1}`, monthFormat)
    }
    changeType = value => {
        this.setState({
            type: value
        })
    }
    onChangeDate = (date, dateString) => {
        this.setState({
            year: dateString.substring(0,4),
            month: dateString.substr(dateString.length-1, 1),
        })
    }

    onChangeContent = e => {
        this.setState({
            content: e.target.value
        })
    }

    onChangeTitle = e => {
        this.setState({
            title: e.target.value
        })
    }

    changeRangeTime = (date, dateString) => {
        this.setState({
            eventBeginTime: dateString[0],
            eventEndTime: dateString[1],
        })
    }

    changeOrgName = e => {
        this.setState({
            visitOrgName: e.target.value 
        })
    }

    changeOrgContent = e => {
        this.setState({
            visitOrgContent: e.target.value 
        })
    }

    changeChannels = e => {
        this.setState({
            channels: e.target.value 
        })
    }

    changeChannelsType = e => {
        this.setState({
            channelsType: e.target.value
        })
    }

    changeUrl = e => {
        this.setState({
            gotoUrl: e.target.value
        })
    }

    uploadImg = data => {
        this.setState({
          imgUrl: imgFormat(data),
          img: data
        })
    }
    
    addUnionWork = () => {
        const { year, month, img, content, title, type, visitOrgName, visitOrgContent, channels, eventBeginTime, 
            eventEndTime, gotoUrl, channelsType } = this.state
        const { closeBox } = this.props 
        if(!type) {
            message.error('请选择工作分类')
        }else if(!year) {
            message.error('请选择分类日期')
        }else if(!img) {
            message.error('请上传封面')
        }else if(!eventBeginTime) {
            message.error('请选择工作时间')
        }else if(!title) {
            message.error('请填写标题')
        }else if(!content) {
            message.error('请填写正文')
        }else if(type === '1004' && !visitOrgName) {
            message.error('请填写拜访机构')
        }else if(type === '1004' && !visitOrgContent) {
            message.error('请填写拜访内容')
        }else if(type === '1005' && channelsType === 99 && !channels) {
            message.error('请填写媒体渠道')
        }else if(!img) {
            message.error('请上传封面')
        }else {
            let data = {
                allianceId: localStorage.getItem('alliance'),
                category: type,
                eventBeginTime,
                eventEndTime,
                month,
                year,
                title,
                gotoUrl,
                coverPic: img,
                description: content,
                visitedResult: visitOrgContent,
                visitedOrganization: visitOrgName,
                channelName: channels,
                mediaChannel: channelsType,  
            }
            this.props.dispatch({
                type: `${namespace}/toEditUnionWork`,
                payload: data
            }).then(rsp => {
                if(rsp && rsp.code === 0) {
                    message.success('添加成功！')
                    closeBox()
                }
            })
        }
    }

    render() {
        const { closeBox } = this.props
        const { unionTypeList } = this.props[namespace]
        const { imgUrl, content, title, type, visitOrgName, visitOrgContent, channels, channelsType, defaultDate, gotoUrl } = this.state
        const typeOptions = []
        if(unionTypeList.length > 0) {
            unionTypeList.forEach(item => {
                typeOptions.push(<Option key={item.id} value={item.id}>{item.name}</Option>)
            })
        }
        return (
        <Modal
            title="添加特色工作"
            width="900px"
            visible={true}
            onCancel={closeBox}
            maskClosable={false}
            footer={null}
          >
           <div className={style.item}>
                <div className={style.label}>工作分类</div>
                <div className={style.value}>
                 <Select placeholder="请选择工作分类" style={{ width: '200px'}} onChange={this.changeType}>
                   {typeOptions}
                 </Select> 
                </div>
           </div>
           <div className={style.item}>
                <div className={style.label}>分类日期</div>
                <div className={style.value}>
                  <DatePicker onChange={this.onChangeDate} picker="month" defaultValue={defaultDate} placeholder="请选择日期" style={{ width: '200px'}}/> 
                </div>
           </div>
           <div className={style.item}>
                <div className={style.label}>标题</div>
                <div className={style.value}>
                    <Input value={title}  onChange={this.onChangeTitle}/>
                </div>
           </div> 
           <div className={style.sitem}>
                <div className={style.label}>正文</div>
                <div className={style.value}>
                <TextArea
                    value={content}
                    onChange={this.onChangeContent}
                    autoSize={{ minRows: 3, maxRows: 5 }}
                />
                </div>
           </div>
           {
               type === '1004' && 
                <>
                <div className={style.item}>
                <div className={style.label}>拜访机构</div>
                <div className={style.value}>
                    <Input value={visitOrgName} onChange={this.changeOrgName}/>
                </div>
                </div> 
                <div className={style.sitem}>
                    <div className={style.label}>拜访结论</div>
                    <div className={style.value}>
                    <TextArea
                        value={visitOrgContent}
                        onChange={this.changeOrgContent}
                        autoSize={{ minRows: 2, maxRows: 4 }}
                    />
                    </div>
                </div>
                </>
            } 
            {
               type === '1005' && 
               <>
                <div className={style.sitem}>
                    <div className={style.label}>媒体宣传渠道</div>
                    <div className={style.value}>
                    <Radio.Group onChange={this.changeChannelsType} value={channelsType}>
                        <Radio value={1}>钱塘先锋</Radio>
                        <Radio value={99}>其他</Radio>
                    </Radio.Group>
                    </div>
                </div>
               {channelsType === 99 && <div className={style.sitem}>
                    <div className={style.label}>宣传渠道名称</div>
                    <div className={style.value}>
                    <TextArea
                        value={channels}
                        onChange={this.changeChannels}
                        autoSize={{ minRows: 2, maxRows: 4 }}
                    />
                    </div>
                </div>}
            </>
           } 
             {
               (type === '1005' || type === '1003') && 
                <div className={style.item}>
                <div className={style.noLabel}>外部链接</div>
                <div className={style.value}>
                    <Input value={gotoUrl} onChange={this.changeUrl}/>
                </div>
                </div> 
            } 
           <div className={style.item}>
                <div className={style.label}>工作时间</div>
                <div className={style.value}>
                <RangePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    onChange={this.changeRangeTime}
                    />
                </div>
           </div>
           <div className={style.sitem}>
                <div className={style.label}>封面</div>
                <div className={style.value}>
                  <MyUpload imgUrl={imgUrl} fn={this.uploadImg} width={280} height={167}/>
                </div>
           </div>  
           <div className={style.options}>
                <Button className={style.defaultBtn} onClick={closeBox}>取消</Button>
                <Button type="primary" style={{marginLeft: '30px'}} onClick={this.addUnionWork}>确认</Button>
           </div>
          </Modal> 
        )
    }
}

export default AddItem