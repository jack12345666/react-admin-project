import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Button, Row, Col, Input, Form, Divider, message} from 'antd'
import { getArrayProps, imgFormat } from '@/utils/utils'
import Editor from '@/components/editor/Editor'
import UploadImg from '@/components/uploadImg'
import style from './style.scss'
const namespace = 'union'
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

@connect(({union}) => ({union}))
class OrgItem extends Component {
    state = {
        logo: '',
        logoUrl: '',
        businessScopePath: '',
        businessScopePathUrl: '',
        description: '',
        userId: null,
    }
    formRef = React.createRef()
    introduceEditor = React.createRef()
    componentDidMount() {
        const { orgId } = this.props
        this.props.dispatch({
            type: `${namespace}/fetchOrgDetail`,
            payload: orgId
        }).then(() => {
            const { orgDetail } = this.props[namespace]
            if(orgDetail) {
               this.formRef.current.setFieldsValue({
                userId: orgDetail.userId,
                name: orgDetail.name,
                tel: orgDetail.tel, 
                address: orgDetail.address,
                businessScope: orgDetail.businessScope,
                allianceFeature: orgDetail.allianceFeature,
                contact: orgDetail.contact,
                mobile: orgDetail.mobile,
                email: orgDetail.email
              })
              this.setState({
                 logo: imgFormat(orgDetail.logoPath),
                 logoUrl: orgDetail.logoPath,
                 businessScopePath: imgFormat(orgDetail.businessScopePath),
                 businessScopePathUrl: orgDetail.businessScopePath,
                 description: orgDetail.description || '<p></p>',
                 userId: orgDetail.userId,
              })
            }else {
              this.setState({
                description: '<p></p>'
              })
            }
        })
    }

    uploadLogoImg = (data) => {
        this.setState({
          logo: imgFormat(data),
          logoUrl: data
        })
    }

    uploadbusinessScopeImg = (data) => {
    this.setState({
        businessScopePath: imgFormat(data),
        businessScopePathUrl: data
     })
    }
  
    onFinish = values => {
        const { closeBox, orgId } = this.props
        const { orgDetail } = this.props[namespace]
        const { logoUrl, businessScopePathUrl, description, userId } = this.state
        values['id'] = orgId
        values['userId'] = userId
        values['description'] = this.introduceEditor.current.getEditorValue() === '<p></p>' ? description : this.introduceEditor.current.getEditorValue(),
        values['logoPath'] = logoUrl
        values['businessScopePath'] = businessScopePathUrl
        values['allianceIds'] = orgDetail.alliances.length > 0 ? getArrayProps(orgDetail.alliances, 'id').join(',') : ''
        if (this.introduceEditor.current.getEditorValue() === '<p></p>' || !this.introduceEditor.current.getEditorValue()) {
          message.error('请填写公司简介')
          return
        } 
        if(!values['logoPath']) {
          message.error('请上传公司logo')
          return
        }
        // if(!(/^([1]\d{10}|([\(（]?0[0-9]{2,3}[）\)]?[-]?)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?)$/.test(values['tel']))){ 
        //   message.error("联系电话格式不正确") 
        //   return
        // }
        this.props.dispatch({
            type: `${namespace}/editOrgInfo`,
            payload: values
        }).then(rsp => {
            if(rsp && rsp.code === 0) {
                message.success('编辑成功！')
                closeBox()
            }
        })
       
    }
    render() {
        const { closeBox } = this.props
        const { logo, businessScopePath, description } = this.state
        return (
             <Modal
                width="1000px"
                title={'编辑单位信息'}
                onCancel={closeBox}
                maskClosable={false}
                visible={true}
                footer={null}
             >   
               <Form ref={this.formRef} name="control-ref" onFinish={this.onFinish}>
                <Row>
                <Col span={11}>
                  <Form.Item {...twoLayout} name="name" label="单位名称" rules={[ { required: true } ]}>
                     <Input style={{marginLeft: '10px'}} disabled={true}/>
                  </Form.Item> 
                </Col>
          
                <Col span={24}>
                <div className={style.imgItem}>
                    <div className={style.imgTitle}>
                     <div className={style.logo}>单位logo:</div>  
                     <div className={style.tips}>(推荐大小 80*80)</div>  
                    </div> 
                   <UploadImg imgUrl={logo} width={80} height={80} fn={this.uploadLogoImg}/>
                  </div>
                </Col>
                <Col span={11}>
                  <Form.Item {...twoLayout} name="contact" label="联系人" rules={[ { required: true } ]}>
                     <Input style={{marginLeft: '10px'}} />
                  </Form.Item> 
                </Col>
                <Col span={11} offset={2}>
                  <Form.Item {...twoLayout} name="tel" label="联系电话">
                     <Input  style={{ width: '100%'}}/>
                  </Form.Item> 
                </Col>
                <Col span={11}>
                  <Form.Item {...twoLayout} name="mobile" label="联系手机" rules={[ { required: true, message:'联系手机格式不正确',pattern: /^([1]\d{10}|([\(（]?0[0-9]{2,3}[）\)]?[-]?)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?)$/ } ]}>
                     <Input style={{marginLeft: '10px'}} />
                  </Form.Item> 
                </Col>
                <Col span={11} offset={2}>
                  <Form.Item {...twoLayout} name="email" label="联系邮箱" >
                     <Input  style={{ width: '100%'}}/>
                  </Form.Item> 
                </Col>
                <Col span={24}>
                  <Form.Item {...layout} name="address" label="联系地址" rules={[{required: true, message: '请填写联系地址'}]}>
                    <TextArea rows={2} placeholder="请填写联系地址"/>
                 </Form.Item>
                </Col> 
                <Col span={24}>
                  <Form.Item {...layout} name="allianceFeature" label="党建特色">
                    <TextArea  rows={2} placeholder="请填写党建特色"/>
                 </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item {...layout} name="businessScope" label="主营业务">
                    <TextArea  rows={2} placeholder="请填写主营业务"/>
                 </Form.Item>
                </Col> 
                <Col span={24}>
                   <div className={style.imgItem}>
                     <div className={style.imgTitle}>
                       <div>业务介绍图</div>
                       <div className={style.tips}>(推荐大小：600*400)</div>
                      </div> 
                     <div>
                      <UploadImg imgUrl={businessScopePath} width={600} height={400} fn={this.uploadbusinessScopeImg}/>
                    </div>
                  </div>
                </Col>
                <Col span={24}>
                  <div className={style.item}>
                            <div className={style.label}>单位简介</div>
                            <div className={style.value}>
                            {description && <Editor id={'orgEditor'} value={description} width={'100%'} height={'240'} ref={this.introduceEditor} />}
                        </div> 
                      </div>
                </Col>
                
             </Row>
             <Form.Item {...tailLayout} style={{marginTop: '20px'}}>
             <Button type="primary" htmlType="submit">修改</Button><Divider type="vertical" />
             <Button htmlType="button" onClick={closeBox}>取消</Button>
            </Form.Item>
             </Form>   
          </Modal>
        )
    }
}

export default OrgItem