import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Row, Col } from 'antd'
import { imgFormat } from '@/utils/utils'

import style from './index.scss'

const namespace = 'needs'
@connect(({needs}) => ({needs}))
class NeedsDetail extends Component {
    state = {
      name: '',
      amount: null,
      budgetPrice: null,
      time: '',
      contact: '',
      tel: '',
      content: '',
      comment: '',
      companyName: '',
      files: []  
    }
    componentDidMount() {
        const { needsId } = this.props
        this.props.dispatch({
            type: `${namespace}/fetchNeedsDetail`,
            payload: needsId
        }).then(() => {
            const { needsDetail } = this.props[namespace]
             const {id, name, comment, budgetPrice, contact, content, expirybegindate, expiryenddate, tel,amount, companyName } = needsDetail
                 this.setState({
                 id, name,comment, budgetPrice, contact, content, tel,amount,companyName,
                 time: `${expirybegindate} - ${expiryenddate}`
             }) 
          if(needsDetail.files.length > 0) {
            let arr = []
            needsDetail.files.forEach((item,index) => {
                arr.push({
                    id: item.id,
                    name: `附件${index+1}`,
                    url: imgFormat(item.filepath)
                })
            })
            this.setState({
                files: arr
            })
        }
      })
    }
    render() {
        const { closeBox } = this.props
        const { name, comment, budgetPrice, contact, content, tel, amount, companyName, time, files } = this.state
        return (
            <Modal
              width={'900px'}
              title={'需求详情'}
              visible={true}
              footer={null}
              onCancel={closeBox}
            >
             <Row>
                 <Col span={24}>
                     <div className={style.item}>
                         <div className={style.label}>采购名称</div>
                         <div className={style.value}>{name}</div>
                     </div>
                 </Col>
                 <Col span={12}>
                     <div className={style.item}>
                         <div className={style.label}>采购数量</div>
                         <div className={style.value}>{amount}</div>
                     </div>
                 </Col>
                 <Col span={12}>
                     <div className={style.item}>
                         <div className={style.label}>预算金额</div>
                         <div className={style.value}>{budgetPrice}</div>
                     </div>
                 </Col>
                 <Col span={12}>
                     <div className={style.item}>
                         <div className={style.label}>公司名称</div>
                         <div className={style.value}>{companyName}</div>
                     </div>
                 </Col>
                 <Col span={12}>
                     <div className={style.item}>
                         <div className={style.label}>采购时间</div>
                         <div className={style.value}>{time}</div>
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
                         <div className={style.label}>联系电话</div>
                         <div className={style.value}>{tel}</div>
                     </div>
                 </Col>
                 <Col span={24}>
                     <div className={style.item}>
                         <div className={style.label}>求购内容</div>
                         <div className={style.value}>{content}</div>
                     </div>
                 </Col>
                 <Col span={24}>
                     <div className={style.item}>
                         <div className={style.label}>备注</div>
                         <div className={style.value}>{comment}</div>
                     </div>
                 </Col>
                 {files.length > 0 && <Col span={24}>
                     <div className={style.item}>
                         <div className={style.label}>附件</div>
                         <div className={style.value}>
                         {
                            files.map(item => (
                                <div key={item.id}>
                                    <a href={item.url}>{item.name}</a>
                                </div>
                            ))
                        }  
                         </div>
                     </div>
                 </Col>}
            </Row>   

           </Modal>
        )
    }
}

export default NeedsDetail