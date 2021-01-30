import React, { Component } from 'react'
import { connect } from 'dva'
import { imgFormat } from '@/utils/utils'
import { Modal, Row, Col } from 'antd'
import style from './index.scss'

const namespace = 'product'
const nameObj = {
    1: '资源',
    2: '促销',
    3: '服务'
}

@connect(({product}) => ({product}))
class GoodsDetail extends Component {
    state = {
        contact: '',
        promotionType: null,
        email: '',
        phone: null,
        tel: '',
        name: '',
        advword: '',
        description: '',
        price: null,
        promotionprice: null,
        categoryOne: '',
        categoryTwo: '',
        mainImg: '',
        time: '',
        images: [],
        storename: '',
        nameType: 1
    }
    componentDidMount() {
        const { goodsId } = this.props
        if(goodsId) {
            this.props.dispatch({
                type: `${namespace}/fetchProductDetail`,
                payload: goodsId
              }).then(() => {
                const { productDetail } = this.props[namespace]   
                this.setState({
                    promotionType: (productDetail.isPromotion === 1 && productDetail.price === -1) ? 0 : 1,
                    contact: productDetail.mallstore.sellername,
                    email: productDetail.email || productDetail.mallstore.email,
                    phone: productDetail.phone || productDetail.mallstore.phone,
                    tel: productDetail.tel || productDetail.mallstore.tel,
                    name: productDetail.name,
                    description: productDetail.description,
                    advword: productDetail.advword,
                    price: productDetail.price,
                    storename: productDetail.storename,
                    promotionprice: productDetail.promotionprice,
                    mainImg: imgFormat(productDetail.image),
                    time: productDetail.isPromotion === 1 ? `${productDetail.promotionbegintime} - ${productDetail.promotionendtime}` : productDetail.workingtime,
                    categoryOne: productDetail.categorys.length > 0 ? productDetail.categorys[0].commoncategoryname : '',
                })
                let type = null
                if(productDetail.isPromotion === 1 && productDetail.price >= 0) {
                    type = 1
                }else if(productDetail.isPromotion === 0) {
                    type = 3
                }else {
                    type = 2
                }
                let imgArr = []
                if(productDetail.images.length > 0) {
                    productDetail.images.forEach(item => {
                      imgArr.push({
                        url:imgFormat(item.url),
                      })
                   })
                }
                this.setState({
                    images: imgArr,
                    nameType: type
                })
                if(productDetail.categorys.length > 1) {
                    let arr = productDetail.categorys.slice(1, 100)
                    let arrTwo = []
                    arr.forEach(item => {
                        arrTwo.push(item.commoncategoryname)
                    })
                    this.setState({
                        categoryTwo: arrTwo.join(',')
                    })
                }
            })
        }
    }
    render() {
        const { closeBox, title } = this.props
        const { promotionType, contact, email, phone, tel, name, advword, price, promotionprice, description, mainImg, images, categoryOne, categoryTwo, time, nameType, storename } = this.state
        return (
            <Modal
              width={'1000px'}
              title={title}
              visible={true}
              footer={null}
              onCancel={closeBox}
            >
             <Row>
             <Col span={24}>
                  <div className={style.item}>
                        <div className={style.label}>单位名称</div>
                        <div className={style.value}>{storename}</div>
                    </div>
                </Col>
              {(nameType === 1 || nameType === 2) && <Col span={12}>
                    <div className={style.item}>
                        <div className={style.label}>促销方式</div>
                        <div className={style.value}>{promotionType === 0 ? '全场促销' : '资源促销'}</div>
                    </div>
                </Col>}
                <Col span={12}>
                  <div className={style.item}>
                        <div className={style.label}>{nameType === 3  ? '服务时间' : '促销时间' }</div>
                        <div className={style.value}>{name}</div>
                    </div>
                </Col>
              {nameType === 1 && <><Col span={12}>
                  <div className={style.item}>
                        <div className={style.label}>促销价格</div>
                        <div className={style.value}>{price}元</div>
                    </div>
                </Col>
                <Col span={12}>
                  <div className={style.item}>
                        <div className={style.label}>促销价格</div>
                        <div className={style.value}>{promotionprice}元</div>
                    </div>
                </Col></>}
                {nameType === 3 && <><Col span={12}>
                  <div className={style.item}>
                        <div className={style.label}>收费模式</div>
                        <div className={style.value}>{price === 0 ? '免费' : price === -1  ? '面议' : price}</div>
                    </div>
                </Col>
                <Col span={12}>
                  <div className={style.item}>
                        <div className={style.label}>服务价格</div>
                        <div className={style.value}>{price > 0 ? price : ''}</div>
                    </div>
                </Col></>}
                <Col span={24}>
                  <div className={style.item}>
                        <div className={style.label}>{nameObj[nameType]}时间</div>
                        <div className={style.value}>{time}</div>
                    </div>
                </Col>
                <Col span={24}>
                  <div className={style.item}>
                        <div className={style.label}>{nameObj[nameType]}信息</div>
                        <div className={style.value}>{advword}</div>
                    </div>
                </Col>
                <Col span={12}>
                  <div className={style.item}>
                        <div className={style.label}>联系人</div>
                        <div className={style.value}>{contact}</div>
                    </div>
                </Col>
                <Col span={12}>
                  <div className={style.item}>
                        <div className={style.label}>手机号</div>
                        <div className={style.value}>{phone}</div>
                    </div>
                </Col>
                <Col span={12}>
                  <div className={style.item}>
                        <div className={style.label}>电话</div>
                        <div className={style.value}>{tel}</div>
                    </div>
                </Col>
                <Col span={12}>
                  <div className={style.item}>
                        <div className={style.label}>邮箱</div>
                        <div className={style.value}>{email}</div>
                    </div>
                </Col>
                <Col span={12}>
                  <div className={style.item}>
                        <div className={style.label}>{nameObj[nameType]}分类</div>
                        <div className={style.value}>{categoryOne}</div>
                    </div>
                </Col>
                <Col span={12}>
                  <div className={style.item}>
                        <div className={style.label}>{nameObj[nameType]}类别</div>
                        <div className={style.value}>{categoryTwo}</div>
                    </div>
                </Col>
                <Col span={24}>
                  <div className={style.img}>
                        <div className={style.label}>{nameObj[nameType]}主图</div>
                        <div className={style.value}>
                            <img src={mainImg} style={{width: '210px', height: '180px'}}/>
                        </div>
                    </div>
                </Col>
                <Row gutter={16}>
                {images.length > 0 && images.map((item, index) => (
                   <Col span={6} key={index}>
                    <div className={style.img}>
                        <div className={style.label}>{`${nameObj[nameType]}介绍图${index+1}`}</div>
                        <div className={style.value}>
                            <img src={item.url} style={{width: '100%'}}/>
                        </div>
                    </div>
                  </Col>  
                ))}
                </Row>
                <Col span={24}>
                  <div className={style.img}>
                        <div className={style.label}>{nameObj[nameType]}描述</div>
                        <div className={style.value} dangerouslySetInnerHTML={{__html: description}}></div>
                    </div>
                </Col>
             </Row>
         </Modal>
        )
    }
}

export default GoodsDetail