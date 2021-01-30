import React, { Component } from 'react'
import { connect } from 'dva'
import { Button, Row, Col, Form, Input, Select, Divider, message, InputNumber, Radio, TimePicker } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import moment from 'moment'
import style from './index.scss'
import { BASEURL } from '@/utils/config'
import MyUpload from '@/components/upload'
import UploadImg from '@/components/uploadImg'
import Editor from '@/components/editor/Editor'

const namespace = 'product'
const { Option } = Select
const { TextArea } = Input
const format = 'HH:mm'
const { RangePicker } = TimePicker
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
class EditItem extends Component {
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
      isInputPrice: false,
      priceRadio: null,
      lastPrice: null
    }
    formRef = React.createRef()
    descEditor = React.createRef()
    componentDidMount() {
        this.getProductInfo()
    }

    uploadGoodsImg = (data) => {
      this.setState({
        goodsImg: BASEURL + data,
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

    
    getProductInfo = () => {
      const { productId } = this.props  
      if(productId) {
        this.props.dispatch({
          type: `${namespace}/fetchProductDetail`,
          payload: productId
        }).then(() => {
          const { productDetail } = this.props[namespace]
          this.formRef.current.setFieldsValue({
            contact: productDetail.mallstore.sellername,
            email: productDetail.email || productDetail.mallstore.email,
            phone: productDetail.phone || productDetail.mallstore.phone,
            tel: productDetail.tel || productDetail.mallstore.tel,
            name: productDetail.name,
            advword: productDetail.advword,
            price: productDetail.price,
            priceRadio: productDetail.price > 1 ? 1 : productDetail.price,
            promotionprice: productDetail.promotionprice,
            categoryOne: productDetail.categorys.length > 0 ? productDetail.categorys[0].commoncategoryname : '',
            categoryOneId: productDetail.categorys.length > 0 ? `${productDetail.categorys[0].commoncategoryid}` : null,
            beginTime: productDetail.workingtime ? moment(productDetail.workingtime.split('-')[0], format) : undefined,
            endTime: productDetail.workingtime ? moment(productDetail.workingtime.split('-')[1], format) : undefined,
          })

          if(productDetail.categorys.length > 1) { 
            let twoArr = productDetail.categorys.slice(1, productDetail.categorys.length)
            let twoCategory = []
            twoArr.forEach(item => {
              twoCategory.push(`${item.commoncategoryid}`)
            }) 
            this.formRef.current.setFieldsValue({
              categoryTwo: twoCategory
            })
         }

         if(this.formRef.current.getFieldValue('beginTime') && this.formRef.current.getFieldValue('endTime')) {
          this.formRef.current.setFieldsValue({
              workingtime: [this.formRef.current.getFieldValue('beginTime'), this.formRef.current.getFieldValue('endTime')]
          })
        }

          if(this.formRef.current.getFieldValue('categoryOneId')) {
            let id = this.formRef.current.getFieldValue('categoryOneId') 
            this.props.dispatch({
               type: `${namespace}/fetchCategoryList`,
               payload: {
                firstId: '0151',
                secondId: id
               }
            })
            let imgArr = []
            if(productDetail.images.length > 0) {
                productDetail.images.forEach(item => {
                  imgArr.push({
                    uid: item.id,
                    id: item.id,
                    url: BASEURL + item.url,
                  })
               })
            }
            this.setState({
              categoryOneId: this.formRef.current.getFieldValue('categoryOneId'),
              description: productDetail.description || '<p></p>',
              images: imgArr,
              goodsImg: productDetail.image ? BASEURL + productDetail.image : '',
              goodsImgUrl: productDetail.image,
              storeId: productDetail.storeid,
              storename: productDetail.storename,
              isInputPrice: productDetail.price === -1 || productDetail.price === 0 ? false : true,
              lastPrice: productDetail.price
            })
           }
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
                firstId: '0151',
                secondId: value
            }
         })
    }

    onRadioChange = e  => {
        this.setState({
          priceRadio: e.target.value
        })
        if(e.target.value === -1 || e.target.value === 0) {
          this.formRef.current.setFieldsValue({
            price: e.target.value
          })
          this.setState({
            isInputPrice: false
          })
        }else {
          this.setState({
            isInputPrice: true
          })
          this.formRef.current.setFieldsValue({
            price: this.state.lastPrice > 0 ? this.state.lastPrice : 1
          })
        }   
    }
  

    onFinish = values => {
       const { description, storename, goodsImgUrl, imagesUrl, delImages, storeId } = this.state
       const { productId } = this.props  
       values['description'] = this.descEditor.current.getEditorValue() === '<p></p>' ? description : this.descEditor.current.getEditorValue()   // 这里不知道什么原因
       values['id'] = productId
       values['storeid'] = storeId
       values['storename'] = storename
       values['storage'] = -1
       values['marketprice'] = 0
       values['promotionprice'] = 0
       values['storeid'] = storeId
       values['image'] = goodsImgUrl
       values['imageIds'] = imagesUrl
       values['delImageIds'] = delImages
       values['isPromotion'] = 0
       values['workingtime'] =values['workingtime'] && values['workingtime'][0] && values['workingtime'][1]  ? `${moment(values['workingtime'][0]).format(format)}-${moment(values['workingtime'][1]).format(format)}` : ''
       let twoStr = (values['categoryTwo'] && values['categoryTwo'].length > 0) ? values['categoryTwo'].join(',') : ''
       if(twoStr) {
           values['commonCategoryIds'] = values['categoryOneId'] + ',' + twoStr
       }else {
          values['commonCategoryIds'] = values['categoryOneId']
       }
       console.log(values)
       if(!values['name']) {
          message.error('请填写服务名称')
       }else if(!values['image']) {
        message.error('请上传服务主图')
       }else if(!values['advword']) {
        message.error('请填写服务简介')
      }else if(!values['categoryOneId']) {
        message.error('请选择服务分类')
      }
      // else if(values['categoryTwo'].length === 0) {
      //   message.error('请选择服务类别')
      //  } 
       else {
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
        const { description, goodsImg, images, isInputPrice, priceRadio } = this.state
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
                <Col span={24}>
                <Form.Item {...layout} name="name" label="服务名称" rules={[{required: true, message: '请填写服务名称'}]}>
                    <Input style={{marginLeft: '-10px'}} placeholder="请填写服务名称"/>
                 </Form.Item>
                </Col>    
                <Col span={11}>
                    <Form.Item {...twoLayout} name="priceRadio" label="收费模式"  rules={[ { required: true, message: '请选择收费模式'  } ]}>
                    <Radio.Group onChange={this.onRadioChange} value={priceRadio}>
                        <Radio value={0}>免费</Radio>
                        <Radio value={1}>收费</Radio>
                        <Radio value={-1}>面议</Radio>
                    </Radio.Group>
                 </Form.Item>
                </Col>
                <Col span={11} offset={2}>
                  <Form.Item {...twoLayout} name="price" label="服务价格"  rules={[{required: true, message: '请填写服务价格'}]}>
                    <InputNumber style={{width: '100%', marginLeft: '-10px'}}  min={priceRadio} disabled={!isInputPrice} placeholder="请填写服务价格"/>
                 </Form.Item>
                </Col> 
                <Col span={24}>
                  <Form.Item {...layout} name="advword" label="服务简介"  rules={[{required: true, message: '请填写服务简介'}]}>
                    <TextArea style={{marginLeft: '-10px'}} rows={2} placeholder="请填写服务简介"/>
                 </Form.Item>
                </Col> 
                <Col span={11}>
                 <Form.Item {...twoLayout} name="contact" label="联系人"  rules={[{required: true, message: '请填写联系人'}]}>
                    <Input  placeholder="请填写联系人"/>
                 </Form.Item>
                </Col>
                <Col span={11} offset={2}>
                <Form.Item {...twoLayout} name="phone" label="手机号" rules={[{required: true, message:'手机号格式不正确',pattern: /^1(3|4|5|6|7|8|9)\d{9}$/}]}>
                        <Input type="number" style={{marginLeft: '-10px'}} placeholder="请填写手机号"/>
                    </Form.Item>
                </Col>    
                <Col span={11}>
                  <Form.Item {...twoLayout} name="tel" label="电话" rules={[{message:'电话格式不正确',pattern: /^([1]\d{10}|([\(（]?0[0-9]{2,3}[）\)]?[-]?)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?)$/}]}>
                    <Input type="number"  placeholder="请填写电话"/>
                 </Form.Item>
                </Col>  
                <Col span={11} offset={2}>
                    <Form.Item {...twoLayout} name="email" label="邮箱" rules={[{message:'邮箱格式不正确',pattern: /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/}]}>
                        <Input style={{marginLeft: '-10px'}} placeholder="请填写邮箱"/>
                    </Form.Item>
                </Col>
                <Col span={11}>
                  <Form.Item {...twoLayout} name="categoryOneId" label="服务分类" rules={[{required: true, message: '请选择服务分类'}]} >
                  <Select onChange={this.changeKind} placeholder="服务分类">
                        {productKindOptions}
                    </Select>
                 </Form.Item>
                </Col>  
                <Col span={11} offset={2}>
                    {/* <Form.Item {...twoLayout} name="categoryTwo" label="服务类别"  rules={[{required: true, message: '请选择服务类别'}]}> */}
                    <Form.Item {...twoLayout} name="categoryTwo" label="服务类别">
                       <Select mode="multiple" style={{marginLeft: '-10px'}}  placeholder="请选择服务类别">
                         {productTypeOptions}
                       </Select>
                    </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item {...layout} name="workingtime" label="服务时间" rules={[{required: true, message: '请选择服务时间'}]}>
                      <RangePicker style={{marginLeft: '-10px', width: '320px'}} placeholder={['开始时间','结束时间']}  format={format}/>
                    </Form.Item>
                </Col>
                <Col span={6} style={{paddingLeft: '10px'}}>
                  <div className={style.img}>
                     <div className={style.imgTitle}>服务主图</div> 
                     <div className={style.imgTips}>推荐大小：210*180</div>
                  </div>
                  <UploadImg imgUrl={goodsImg} fn={this.uploadGoodsImg}/>
                </Col>
                <Col span={24} style={{paddingLeft: '10px'}}>
                  <div className={style.img}>
                     <div className={style.imgMainTitle}>服务介绍图</div> 
                     <div className={style.imgTips}>推荐大小：210*180</div>
                  </div>
                  <MyUpload imgList={images} limit={4} fn={this.uploadMoreImg}/>
                </Col>
                <Col span={24}>
                  <div className={style.title}>服务描述</div>
                  {description && <Editor value={description} id={'desEditor'} width={'100%'} height={'350'} ref={this.descEditor}/>}
                </Col>
            </Row>
            <Form.Item {...tailLayout} style={{marginTop: '20px'}}>
             <Button type="primary" htmlType="submit">修改</Button><Divider type="vertical" />
             <Button htmlType="button" className={style.defaultBtn} onClick={closeBox}>取消</Button>
            </Form.Item>
         </Form>   
         </div>
        )
    }
}

export default EditItem
