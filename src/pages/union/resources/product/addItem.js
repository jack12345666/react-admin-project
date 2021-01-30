import React, { Component } from 'react'
import { connect } from 'dva'
import { Button, Row, Col, Form, Input, Select, Divider, message, InputNumber, DatePicker, Radio } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import moment  from 'moment'
import style from './index.scss'
import { imgFormat } from '@/utils/utils'
import MyUpload from '@/components/upload'
import UploadImg from '@/components/uploadImg'
import Editor from '@/components/editor/Editor'

const namespace = 'product'
const { Option } = Select
const { TextArea } = Input
const { RangePicker } = DatePicker
const format = 'YYYY-MM-DD HH:mm:ss'
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

 
@connect(({ product }) => ({ product }))
class AddItem extends Component {
    state = {
      description: '',
      images: [],
      imagesUrl: '',
      delImages: '',
      categoryOneId: null,
      goodsImg: '',
      goodsImgUrl: '',
      storename: '',
      storeId: null,
      promotionprice: null,
      promotionType: 1,
      inputPrice: null,
      categorySign: true,
    }
    formRef = React.createRef()
    descEditor = React.createRef()
    componentDidMount() {
        this.setState({
            storeId: localStorage.getItem('storeId'),
            storename: localStorage.getItem('storeName')
        }) 
        this.formRef.current.setFieldsValue({
          promotionType: 1
        })
        this.getStoreInfo()  
        this.props.dispatch({
            type: `${namespace}/fetchCategoryList`,
            payload: {
              firstId: '0156'
          }
        })
    }

    uploadGoodsImg = (data) => {
      this.setState({
        goodsImg: imgFormat(data),
        goodsImgUrl: data
      })
    }

    uploadMoreImg = (data, delData) => {
      let str = ''
      let arr = []
      let delStr = ''
      if(data.length > 0) {
          data.forEach(item => {
            if(item.id) {
             arr.push(item.id)
            }
        })
        str = arr.join(',')
      }
      
      if(delData.length > 0) {
        delStr = delData.join(',')
    }
      this.setState({
        images: data,
        imagesUrl: str,
        delImages: delStr
      })
    }

    
    getStoreInfo = () => {
      if(localStorage.getItem('storeId')) {
        this.props.dispatch({
          type: `${namespace}/fetchStoreDetail`,
          payload: localStorage.getItem('storeId')
        }).then(() => {
          const { storeDetail } = this.props[namespace]
          this.formRef.current.setFieldsValue({
            storeid: localStorage.getItem('storeId'),
            contact: storeDetail.sellername,
            email: storeDetail.email,
            phone: storeDetail.phone,
            tel: storeDetail.tel,
          })
        })
      }
    }

    changeKind = value => {
        this.formRef.current.setFieldsValue({
            categoryTwo: undefined
        })
        this.props.dispatch({
            type: `${namespace}/fetchCategoryList`,
            payload: {
              firstId: '0156',
              secondId: value
          }
        })
        if(value === '364') {
          this.setState({
            categorySign: true
          })
        }else {
          this.setState({
            categorySign: false
          })
        }
    }

    changeType = e => {
      this.setState({
        promotionType: e.target.value
      })
    }

    priceChange = value => {
        this.setState({
          inputPrice: value
        })
    }

    promotionpriceChange = value => {
      const { inputPrice } = this.state
      if(inputPrice && (value >= inputPrice)) {
        message.warning("促销价格应该低于促销价格")
      }
     }

    onFinish = values => {
       const { description, storename, goodsImgUrl, imagesUrl, delImages, storeId, promotionType, categorySign } = this.state
       values['description'] = this.descEditor.current.getEditorValue() === '<p></p>' ? description : this.descEditor.current.getEditorValue()   // 这里不知道什么原因
       values['storename'] = storename
       values['storage'] = -1
       values['marketprice'] = 0
       values['storeid'] = storeId
       values['image'] = goodsImgUrl
       values['imageIds'] = imagesUrl
       values['delImageIds'] = delImages
       values['isPromotion'] = 1
       if(!categorySign) {
        values['promotionbegintime'] = `${moment(new Date()).format(format)}`
        values['promotionendtime'] = `${moment('2099-12-30 12:20:20').format(format)}`
        values['promotionprice'] = 0
        values['price'] =  0
       }else {
          values['promotionbegintime'] = values['time'] ? `${moment(values['time'][0]).format(format)}` : undefined
          values['promotionendtime'] = values['time'] ? `${moment(values['time'][1]).format(format)}` : undefined
          values['promotionprice'] = values['promotionprice'] && values['promotionprice'] >= 0  ? values['promotionprice'] : -1
          values['price'] =  values['price'] && values['price'] >= 0  ? values['price'] : -1
       }
       let twoStr = (values['categoryTwo'] && values['categoryTwo'].length > 0) ? values['categoryTwo'].join(',') : ''
       if(twoStr) {
           values['commonCategoryIds'] = values['categoryOneId'] + ',' + twoStr
       }else {
          values['commonCategoryIds'] = values['categoryOneId']
       }
       delete values['time']
       const strObj = {
         0: '促销',
         1: '资源'
       }
       if(!values['name']) {
          message.error(`请填写${strObj[promotionType]}名称`)
       }else if(!values['image']) {
        message.error(`请上传${strObj[promotionType]}主图`)
       }else if(!values['categoryOneId']) {
        message.error(`请选择${strObj[promotionType]}分类`)
       }
      //  else if(values['categoryTwo'].length === 0) {
      //   message.error(`请选择${strObj[promotionType]}类别`)
      //  }
        else if(!values['promotionbegintime']) {
        message.error('请选择促销时间')
       } else {
         this.props.dispatch({
           type: `${namespace}/saveProduct`,
           payload: values
         }).then(rsp => {
           const { closeBox } = this.props
          if(rsp && rsp.code === 0) {
             message.success('操作成功')
             closeBox()
           }
         })
       }
    }

    render() {
        const { productKind, productTypeList } = this.props[namespace]
        const { description, goodsImg, images, promotionType, categorySign } = this.state
        const { closeBox } = this.props
        const productKindOptions = []
        if(productKind.length > 0) {
            productKind.forEach(item => {
                productKindOptions.push(<Option key={item.id}>{item.name}</Option>)
            })
        }
        const productTypeOptions = []
        if(productTypeList.length > 0) {
            productTypeList.forEach(item => {
                productTypeOptions.push(<Option key={item.id}>{item.name}</Option>)
            })
        }
       
        return (
            <div className={style.box}>
                <div className={style.top}>
                 <div></div>
                <CloseOutlined style={{fontSize: '20px'}} title="关闭" onClick={closeBox}/>
           </div>
             <Form ref={this.formRef} name="control-ref" onFinish={this.onFinish}>
                <Row>
                <Col span={11}>
                  <Form.Item {...twoLayout} name="categoryOneId" label={promotionType === 1 ? "资源分类" : "促销分类"} rules={promotionType === 1 ? [{required: true, message: '请选择资源分类'}] : [{required: true, message: '请选择促销分类'}]} >
                  <Select onChange={this.changeKind} placeholder={promotionType === 1 ? "资源分类" : "促销分类"}>
                        {productKindOptions}
                    </Select>
                 </Form.Item>
                </Col>  
                <Col span={11} offset={2}>
                    <Form.Item {...twoLayout} name="categoryTwo" label={promotionType === 1 ? "资源类别" : "促销类别"} > 
                       <Select mode="multiple" style={{marginLeft: '-10px'}}  placeholder={promotionType === 1 ? "资源类别" : "促销类别"}>
                         {productTypeOptions}
                       </Select>
                    </Form.Item>
                </Col>
                {categorySign && <Col span={24}>
                <Form.Item {...layout} name="promotionType" label="促销方式" rules={[{required: true, message: '请选择促销方式'}]}>
                <Radio.Group defaultValue={1} onChange={this.changeType}>
                    <Radio value={1}>资源促销</Radio>
                    <Radio value={0}>全场促销</Radio>
                  </Radio.Group>
                 </Form.Item>
                </Col>} 
                <Col span={24}>
                <Form.Item {...layout} name="name" label={promotionType === 1 ? "资源名称" : "促销名称"} rules={promotionType === 1 ? [{required: true, message: '请填写资源名称' }] : [{required: true, message: '请填写促销名称' }]}>
                    <Input style={{marginLeft: '-10px'}} placeholder={promotionType === 1 ? "请填写资源名称" : "请填写促销名称"}/>
                 </Form.Item>
                </Col>  
                { promotionType === 1 && categorySign &&
                <>
                <Col span={11}>
                 <Form.Item {...twoLayout} name="price" label="资源价格"  rules={[{required: true, message: '请填写资源价格'}]}>
                    <InputNumber style={{width: '100%'}} min={0} max={9999999999} placeholder="请填写资源价格"  onChange={this.priceChange}/>
                 </Form.Item>
                </Col>
                <Col span={11} offset={2}>
                 <Form.Item {...twoLayout} name="promotionprice" label="促销价格"  rules={[{required: true, message: '请填写促销价格'}]}>
                    <InputNumber style={{width: '100%', marginLeft: '-10px'}}  min={0} max={9999999999} placeholder="请填写促销价格" onChange={this.promotionpriceChange}/>
                 </Form.Item>
                </Col> 
                </>
                } 
                { categorySign &&
                   <Col span={24}>
                  <Form.Item {...layout} name="time" label="促销时间" rules={[{required: true, message: '请选择促销时间'}]}>
                      <RangePicker style={{marginLeft: '-10px'}} showTime />
                    </Form.Item>
                </Col>
                }
               
                <Col span={24}>
                  <Form.Item {...layout} name="advword" label="资源简述"  rules={[{required: true, message: '请填写资源简述'}]}>
                    <TextArea style={{marginLeft: '-10px'}} rows={2} placeholder="请填写资源简述"/>
                 </Form.Item>
                </Col>   
                <Col span={11}>
                 <Form.Item {...twoLayout} name="contact" label="联系人"  rules={[{required: true, message: '请填写联系人'}]}>
                    <Input  placeholder="请填写联系人"/>
                 </Form.Item>
                </Col>
                <Col span={11} offset={2}>
                <Form.Item {...twoLayout} name="phone" label="手机号"  rules={[{message:'手机号格式不正确',pattern: /^1(3|4|5|6|7|8|9)\d{9}$/}]}>
                        <Input type="number"  style={{marginLeft: '-10px'}} placeholder="请填写手机号"/>
                    </Form.Item>
                </Col>    
                <Col span={11}>
                  <Form.Item {...twoLayout} name="tel" label="电话" rules={[{message:'电话格式不正确',pattern: /^([1]\d{10}|([\(（]?0[0-9]{2,3}[）\)]?[-]?)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?)$/}]}>
                    <Input placeholder="请填写电话"/>
                 </Form.Item>
                </Col>  
                <Col span={11} offset={2}>
                    <Form.Item {...twoLayout} name="email" label="邮箱" rules={[{message:'邮箱格式不正确',pattern: /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/}]}>
                        <Input style={{marginLeft: '-10px'}} placeholder="请填写邮箱"/>
                    </Form.Item>
                </Col>
              
                <Col span={6} style={{paddingLeft: '10px'}}>
                  <div className={style.img}>
                     <div className={style.imgMainTitle}>{promotionType === 1 ? '资源主图' : '促销主图'}</div> 
                     <div className={style.imgTips}>推荐大小：210*180</div>
                  </div>
                  <UploadImg imgUrl={goodsImg} fn={this.uploadGoodsImg}/>
                </Col>
                <Col span={24} style={{paddingLeft: '10px'}}>
                  <div className={style.img}>
                     <div className={style.imgTitle}>{promotionType === 1 ? '资源介绍图' : '促销介绍图'}</div> 
                     <div className={style.imgTips}>推荐大小：210*180</div>
                  </div>
                  <MyUpload imgList={images} limit={4} fn={this.uploadMoreImg}/>
                </Col>
                <Col span={24}>
                  <div className={style.title}>{promotionType === 1 ? '资源详情' : '促销描述'}</div>
                  <Editor value={description} id={'desEditor'} width={'100%'} height={'350'} ref={this.descEditor}/>
                </Col>
            </Row>
            <Form.Item {...tailLayout} style={{marginTop: '20px'}}>
             <Button type="primary" htmlType="submit">提交</Button><Divider type="vertical" />
             <Button htmlType="button" className={style.defaultBtn} onClick={closeBox}>取消</Button>
            </Form.Item>
         </Form>   
         </div>
        )
    }
}

export default AddItem
