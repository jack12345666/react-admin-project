import React, { Component } from 'react'
import { connect } from 'dva'
import MyUpload from '@/components/uploadImg'
import Editor from '@/components/editor/Editor'
import UploadFile from '@/components/uploadFile'
import { BASEURL } from '@/utils/config'
import moment from 'moment'
import { Button, Row, Col, Input, InputNumber, DatePicker, Divider, Card, message } from 'antd'
import style from './index.scss'

const namespace = 'memorabilia'
const dateFormat = 'YYYY-MM-DD'
@connect(({ memorabilia }) => ({ memorabilia }))
class MemorabiliaItem extends Component {
    state = {
        id: null,
        title: '',
        description: '',
        logo: '',
        logoUrl: '',
        time: '',
        fileList: [],
        fileArr: [],
        displayno: 1,
        delFiles: '',
        fileString: ''
    }
    memoraEditor =  React.createRef()
    componentDidMount() {
        const { detailData } = this.props
        if(detailData) {
           this.setState({
             id: detailData.id,
             title: detailData.title,
             description: detailData.description || '<p></p>',
             logo: detailData.picpath,
             logoUrl: BASEURL + detailData.picpath,
             displayno: +detailData.displayno,
             time: detailData.eventtime,
             fileArr: detailData.attachmentList 
           }) 
           if(detailData.attachmentList.length > 0) {
               let arr = []
               detailData.attachmentList.forEach((item,index) => {
                   arr.push({
                       uid: Math.random().toString().slice(-6) + index,
                       id: item.id,
                       name: item.fileName,
                       url: BASEURL + item.filePath
                   })
               })
               
               this.setState({
                fileList: arr
               })
           }
        }else {
            this.setState({
                description: '<p></p>'
            })
        }
      
    }

    changeTitle = ({ target: { value } }) => {
        this.setState({ 
            title: value
         })
    }

    uploadLogo = data => {
        this.setState({
          logoUrl: BASEURL + data,
          logo: data
        })
    }

    uploadFile = (fileList, delFileList, curentList) => {
        let fileArr = []
        let delFileArr = []
        let fileStr = ''
        let delStr = ''
        if(curentList.length > 0) {
            curentList.forEach(item => {
                fileArr.push(item.id)  
            })
            fileStr = fileArr.join(',')
        }
        if(delFileList.length > 0) {
            delFileList.forEach(item => {
                delFileArr.push(item.id)
            })
            delStr = delFileArr.join(',')
        }
        this.setState({
            fileString: fileStr,
            delFiles: delStr
        })
    }

    onChangeTime = (date, dateString) => {
        this.setState({
            time: dateString
        })
    }

    changeDisplayNo = value => {
        this.setState({
            displayno: value
        })
    } 

    submitContent = () => {
        const { logo, title, displayno, fileString, delFiles, time, id, description } = this.state
        const { closeItem } = this.props
        if(!title) {
            message.error('请填写标题')
        }else if(!logo) {
            message.error('请上传封面图片')
        }else if(!time) {
            message.error('请选择时间')
        }else if(!displayno) {
            message.error('请填写显示顺序')
        }else if(this.memoraEditor.current.getEditorValue() === '<p></p>' || !this.memoraEditor.current.getEditorValue()) {
            message.error('请填写描述')
        }else {
            let data = {}
            data.info = {
                alliance: localStorage.getItem('alliance'),
                category: '0701',
                displayno: displayno,
                picpath: logo,
                id: id || null,
                description: this.memoraEditor.current.getEditorValue() === '<p></p>' ?  description : this.memoraEditor.current.getEditorValue(),
                eventtime: time,
                title: title
            }
            data.file = {saveAttachment: fileString, deleteAttachment: delFiles}
            this.props.dispatch({
                type: `${namespace}/saveAllianceExtend`,
                payload: data
            }).then(rsp => {
                if(rsp && rsp.code === 0) {
                    message.success('操作成功')
                    closeItem()
                }
            })
        }
    }

    render() {
        const { description, logoUrl, title, displayno, fileList, time } = this.state
        const { closeItem, detailData } = this.props
        return (
            <Card title={detailData ? '编辑联盟大事记' : '新增联盟大事记'} bordered={false} style={{ width: '100%' }}>
            <Row>
                <Col span={24}>
                    <div className={style.item}>
                        <div className={style.label}>标题</div>
                        <div className={style.value}>
                           <Input value={title} placeholder="请输入标题" onChange={this.changeTitle}/>
                        </div>
                    </div>
                    <div className={style.sitem}>
                        <div className={style.label}>封面</div>
                        <div className={style.value}>
                           <MyUpload imgUrl={logoUrl} fn={this.uploadLogo} width={180} height={180}/>
                        </div>
                    </div>
                    <div className={style.item}>
                        <div className={style.label}>时间</div>
                        <div className={style.value}>
                        {time ?
                         <DatePicker value={moment(time, dateFormat)} format={dateFormat} onChange={this.onChangeTime} style={{width: '200px'}}/>
                         :
                        <DatePicker onChange={this.onChangeTime} style={{width: '200px'}}/>
                        }    
                        </div>
                    </div>
                    <div className={style.sitem}>
                        <div className={style.label}>描述</div>
                        <div className={style.value}>
                        {description && <Editor id={'memoraEditor'} value={description} width={'100%'} height={'240'} ref={this.memoraEditor} />} 
                        </div>
                    </div>
                    <div className={style.item}>
                        <div className={style.label}>显示顺序</div>
                        <div className={style.value}>
                          <InputNumber min={0} value={displayno} onChange={this.changeDisplayNo} style={{width: '200px'}}/> 
                        </div>
                    </div>
                    <div className={style.sitem}>
                        <div className={style.labels}>附件</div>
                        <div className={style.value}>
                            <UploadFile fileList={fileList} fn={this.uploadFile}/>
                        </div>
                    </div>
                    <div className={style.btns}>
                        <Button type="primary" onClick={this.submitContent}>确定</Button><Divider type="vertical" />
                        <Button className={style.defaultBtn} onClick={closeItem}>取消</Button>
                    </div>
                </Col>
            </Row>
         </Card>
        )
    }
}

export default MemorabiliaItem