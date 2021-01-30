import React, { Component } from 'react'
import { connect } from 'dva'
import { Button, Form, DatePicker, Row, Col, Input, Radio, Divider, InputNumber, Tooltip, message } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import moment from 'moment'
import { BASEURL } from '@/utils/config'
import MyUpload from '@/components/uploadImg'
import Editor from '@/components/editor/Editor'
import ActivityDetail from '../../../components/activityDetail'
import Style from './index.scss'

const namespace = 'activity'
const format = 'YYYY-MM-DD HH:mm'
const { RangePicker } = DatePicker
const { TextArea } = Input
const layout = {
    labelCol: {
      span: 2,
    },
    wrapperCol: {
      span: 21, 
      offset: 1,
    }
}
const twoLayout = {
    labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 18, 
        offset: 2,
      }
}
const tailLayout = {
    wrapperCol: {
      offset: 10,
      span: 14,
    }
 }
@connect(({ activity }) => ({ activity }))
class AddActivity extends Component {
    state = {
        mainImg: '',
        activityDetail: '',
        activityType: 1,
        poster: '',
        posterUrl: '',
        description: '',
        showInputNumber: false,
        showDetail: false,
        previewData: null,
    }
    formRef = React.createRef()
    activityEditor = React.createRef()
    componentDidMount() {
          this.formRef.current.setFieldsValue({
            activeType: 1,
            category: 1,
            allNumber: -1,
            amount: 1,
            needAllow: 1,
            companyId: localStorage.getItem('orgId'),
            companyName: localStorage.getItem('orgName'),
            auditType: 0,
         })
    }

    uploadPoster = (data) => {
        this.setState({
          poster: BASEURL + data,
          posterUrl: data
        })
     }

    onChange = e => {
        this.setState({
            activityType: e.target.value
        })
    }

    onAmountChange = e => {
       if(e.target.value === 1) {
           this.setState({
               showInputNumber: true
           })
       }else {
        this.setState({
            showInputNumber: false
        }) 
       }
    }


    preview = () => {
      const { poster, description } = this.state
      if(this.formRef.current.getFieldValue('name') === undefined || this.formRef.current.getFieldValue('comment') === undefined ||
      this.formRef.current.getFieldValue('contact') === undefined || this.formRef.current.getFieldValue('companyId') === undefined ||
      this.formRef.current.getFieldValue('sponsor') === undefined || this.formRef.current.getFieldValue('tel') === undefined ||
      this.formRef.current.getFieldValue('time') === undefined || !poster
      ) {
          message.warning('信息填写完成后才能预览哟！')
          return
      }else {
          let data = this.formRef.current.getFieldsValue()
          data.begindate = `${moment(this.formRef.current.getFieldValue('time')[0]).format(format)}`
          data.enddate = `${moment(this.formRef.current.getFieldValue('time')[1]).format(format)}`
          data.content = this.activityEditor.current.getEditorValue() === '<p></p>' ? description : this.activityEditor.current.getEditorValue()   // 这里不知道什么原因
          data.poster = poster
          data.amount = this.formRef.current.getFieldValue('allNumber') === 1 ? this.formRef.current.getFieldValue('amount') : -1
          data.tel = this.formRef.current.getFieldValue('tel')
          delete data.time
          delete data.allNumber
          this.setState({
            previewData: data,
            showDetail: true
        })
      }   
    }

    closeBox = () => {
        this.setState({
            previewData: null,
            showDetail: false
        })
    }
    
    onFinish = values => {
        const { description, posterUrl } = this.state 
        values['poster'] = posterUrl
        values['begindate'] = values['time'] ? `${moment(values['time'][0]).format(format)}` : ''
        values['enddate'] =  values['time'] ? `${moment(values['time'][1]).format(format)}` : ''
        values['content'] = this.activityEditor.current.getEditorValue() === '<p></p>' ? description : this.activityEditor.current.getEditorValue()
        values['amount'] = values['allNumber'] === 1 ? values['amount'] : -1
        values['alliance'] = localStorage.getItem('alliance')
        values['companyId'] = localStorage.getItem('orgId')
        values['auditType'] = 0
        delete values['allNumber']
        delete values['time']
        if(!values['contact']) {
            message.error('请填写联系人')
            return
        }else if(!values['begindate']) {
             message.error('请选择活动开始截止时间')
             return   
        }else if(!values['sponsor']) {
            message.error('请填写主办方')
            return
        }else if(!values['tel']) {
            message.error('请填写联系方式')
            return
        }else if(!values['poster']) {
            message.error('请上传一张活动海报')
            return
        }else if(!values['comment']) {
            message.error('请填写线下活动说明')
            return
        }else {
            this.props.dispatch({
                type: `${namespace}/saveActivity`,
                payload: values
            }).then(rsp => {
                if(rsp.code === 0) {
                    message.success('活动添加成功')
                    this.props.history.push('/redUnion/activityList/')
                }
            })
        }
    }

    render() {
        const { activityType, poster, showInputNumber, showDetail, description, previewData } = this.state
        return (
            <div className={Style.box}>
                <Form ref={this.formRef} name="control-ref" onFinish={this.onFinish}>
                <Row>
                <Col span={11}>
                  <Form.Item {...twoLayout} name="companyName" label="关联单位" rules={[ { required: true, message: '请选择单位'  } ]}>
                  <Input disabled={true} style={{marginLeft: '10px'}}/>
                  </Form.Item> 
                </Col>
                <Col span={11} offset={2}>
                <Form.Item {...twoLayout} name="sponsor" label="主办方"  rules={[ { required: true, message: '请填写主办方'  } ]}>
                    <Input placeholder="请填写主办方"/>
                 </Form.Item>
                </Col>  
                <Col span={11}>
                  <Form.Item {...twoLayout} name="contact" label="联系人" rules={[ { required: true, message: '请填写联系人'  } ]}>
                       <Input placeholder="请填写联系人" style={{marginLeft: '10px'}}/>
                  </Form.Item> 
                </Col>
                <Col span={11} offset={2}>
                <Form.Item {...twoLayout} name="tel" label="联系方式"  rules={[ { required: true, message: '请填写联系方式' } ]}>
                    <Input placeholder="请填写联系方式"/>
                 </Form.Item>
                </Col>  
                 <Col span={24}>
                  <Form.Item {...layout} name="name" label="活动名称"  rules={[ { required: true, message: '请填写活动名称'  } ]}>
                    <Input placeholder="请填写活动名称"/>
                  </Form.Item>
                </Col> 
                <Col span={24}>
                  <div className={Style.img}>
                     <div className={Style.imgTitle}>活动海报:</div> 
                     <div style={{marginLeft: '-70px'}}>
                       <MyUpload imgUrl={poster} fn={this.uploadPoster} width={510} height={280}/>
                     </div>
                     <div className={Style.imgTips}>建议尺寸：510*280</div> 
                  </div>
                </Col>
                <Col span={24}>
                  <Form.Item {...layout} name="time" label="活动时间"  rules={[ { required: true, message: '请选择活动时间'  } ]}>
                    <RangePicker format="YYYY/MM/DD HH:mm" showTime placeholder={['开始时间', '结束时间']}/>
                  </Form.Item>
                </Col> 
                <Col span={24}>
                  <Form.Item {...layout} name="category" label="活动类型"  rules={[ { required: true } ]}>
                  <Radio.Group onChange={this.onChange} value={null}>
                    <Radio value={1}>线上活动</Radio>
                    <Radio value={2}>线下活动</Radio>
                   </Radio.Group>
                  </Form.Item>
                </Col> 
                <Col span={24}>
                  <Form.Item {...layout} name="comment" label="活动说明" rules={activityType === 1 ? [{required: true, message: '请填写线上活动链接'}] : [{required: true, message: '请填写线下活动地址'}]}>
                    <TextArea placeholder={activityType === 1 ? '请填写线上活动链接' : '请填写线下活动地址'} autoSize={{minRows: 2, maxRows: 3 }}/>
                  </Form.Item>
                </Col> 
                <Col span={11}>
                  <Form.Item {...twoLayout} name="allNumber" label="活动人数"  rules={[{required: true}]}>
                  <Radio.Group style={{marginLeft: '8px'}} onChange={this.onAmountChange} value={null}>
                    <Radio value={1}>有上限</Radio>
                    <Radio value={-1}>无上限</Radio>
                   </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={11}>
                    {showInputNumber &&
                     <Form.Item name="amount" label="上限人数" rules={[{required: true}]}>
                      <InputNumber min={1} max={10000} style={{width: '100%'}}/>
                    </Form.Item>}
                </Col> 
                <Col span={24}>
                  <Form.Item {...layout} name="needAllow" label="报名审核"  rules={[{required: true}]}>
                  <Radio.Group value={null}>
                    <Radio value={1}>是</Radio>
                    <Radio value={0}>否</Radio>
                   </Radio.Group>
                  </Form.Item>
                   <Tooltip placement="topLeft" title="是否需要主办方审核，才能报名成功，'是'表示需要主办方审核通过后，才算报名成功，'否'表示不需要审核，用户直接提交报名就可以报名成功">
                       <QuestionCircleOutlined  style={{position: 'absolute', left: '75px', top: '10px'}}/>
                  </Tooltip>
                </Col> 
                <Col span={24}>
                   <div className={Style.editor}>
                    <div className={Style.title}>活动详情:</div>
                    <Editor id={'activityEditor'} value={description} width={'100%'} height={'350'} ref={this.activityEditor}/>
                   </div>
                </Col>
                </Row>
                <Form.Item {...tailLayout} style={{marginTop: '20px'}}>
                 <Button htmlType="button" onClick={this.preview}>预览</Button><Divider type="vertical" />
                 <Button type="primary" htmlType="submit">发布</Button>
                </Form.Item>
                </Form>
                {showDetail && <ActivityDetail closeBox={this.closeBox} isPreview={true} data={previewData}/>}
            </div>
        )
    }
}

export default AddActivity