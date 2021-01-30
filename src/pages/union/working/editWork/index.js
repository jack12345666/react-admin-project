import React, { Component } from 'react'
import { connect } from 'dva'
import { DatePicker, Select, Input, Button, Card, Radio, message } from 'antd'
import MyUpload from '@/components/uploadImg'
import { imgFormat, inputZero } from '@/utils/utils'
import style from './index.scss'
import moment from 'moment'

const { Option } = Select
const { TextArea } = Input
const { RangePicker } = DatePicker
const namespace = 'work'
@connect(({ work }) => ({ work }))
class EditWork extends Component {
    state = {
       id: null,
       type: '',
       year: '',
       month: '',
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
       date: null,
       time: null,
       gotoUrl: '',
    }
    
    componentDidMount() {
        const { workDetail } = this.props[namespace]
        if(workDetail) {
          const { id, month, year, title, description, eventEndTime, eventBeginTime, category, visitedOrganization,
            visitedResult, coverPic, channelName, mediaChannel, gotoUrl } = workDetail
          this.setState({
            id, month, year, title,
            content: description,
            imgUrl: imgFormat(coverPic),
            img: coverPic,
            eventBeginTime,
            eventEndTime,
            channels: channelName,
            channelsType: mediaChannel,
            visitOrgName: visitedOrganization,
            visitOrgContent: visitedResult,
            type: category,
            gotoUrl,
            date: moment(`${year}-${inputZero(month)}`, 'YYYY-MM'),
            time: [moment(eventBeginTime, 'YYYY-MM-DD HH:mm:ss'), moment(eventEndTime, 'YYYY-MM-DD HH:mm:ss')]
         })  
       }
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
            date: date
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
        if(date) {
           this.setState({
            eventBeginTime: dateString[0],
            eventEndTime: dateString[1],
            time: [date[0], date[1]]
         }) 
        } 
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

    uploadImg = data => {
        this.setState({
          imgUrl: imgFormat(data),
          img: data
        })
     }

     cancelBox = () => {
         this.props.history.go(-1)
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

    editUnionWork = () => {
        const {id, year, month, img, content, title, type, visitOrgName, visitOrgContent, channels, eventBeginTime, 
            eventEndTime, channelsType, gotoUrl  } = this.state
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
                id,
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
                    message.success('修改成功！')
                    this.cancelBox()
                }
            })
        }
    }

    render() {
        const { imgUrl, content, title, type, visitOrgName, visitOrgContent, channels, channelsType, date, time, gotoUrl } = this.state
        const { unionTypeList } = this.props[namespace]
        const typeOptions = []
        if(unionTypeList.length > 0) {
            unionTypeList.forEach(item => {
                typeOptions.push(<Option key={item.id} value={item.id}>{item.name}</Option>)
            })
        }
        return (
            <Card title="编辑特色活动" bordered={false}>
           <div className={style.item}>
                <div className={style.label}>活动分类</div>
                <div className={style.value}>
                 <Select disabled={true} value={`${type}`} style={{ width: '200px'}} onChange={this.changeType}>
                  {typeOptions}
                 </Select> 
                </div>
           </div>
           <div className={style.item}>
                <div className={style.label}>分类日期</div>
                <div className={style.value}>
                  <DatePicker disabled={true} value={date} onChange={this.onChangeDate} picker="month"  placeholder="请选择日期" style={{ width: '200px'}}/> 
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
                <div className={style.label}>活动时间</div>
                <div className={style.value}>
                <RangePicker
                    value={time}
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
                <Button className={style.defaultBtn} onClick={this.cancelBox}>取消</Button>
                <Button type="primary" style={{marginLeft: '30px'}} onClick={this.editUnionWork}>修改</Button>
           </div>
        </Card>
        )
    }
}

export default EditWork