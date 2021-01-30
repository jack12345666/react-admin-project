import React, { Component } from 'react'
import { Modal, Button, Tag, Card, Empty } from 'antd'
import { imgFormat } from '@/utils/utils'
import Style from './index.scss'

class ActivityDetail extends Component {
    render() {
        const { closeBox, data, isPreview } = this.props
        return (
          <div>
         { data &&
           <Modal
            title={isPreview ? '预览活动': '活动详情'}
            width={1200}
            visible={true}
            onCancel={closeBox}
            maskClosable={false}
            footer={null}
            >
            <div className={Style.box}>
                <div className={Style.top}>
                    <div className={Style.img}>
                        <img style={{width: '500px', height: '280px'}} src={imgFormat(data.poster)}/>
                    </div>
                    <div className={Style.right}>
                        <div className={Style.name}><Tag color="#108ee9">{data.category === 1 ? '线上' : '线下'}</Tag>{data.name}</div>
                        <div className={Style.item}>
                            <div className={Style.label}>活动时间:</div>
                            <div className={Style.value}>{data.begindate} 至 {data.enddate}</div>  
                        </div>
                        <div className={Style.item}><div className={Style.label}>主办方:</div> 
                        <div className={Style.value}>{data.sponsor}</div>
                        </div>
                        <div className={Style.item}>
                            <div className={Style.label}>活动说明:</div>
                            <div className={Style.value}>{data.comment}</div> 
                            </div>
                        <div className={Style.item}>
                            <div className={Style.label}>活动人数:</div>
                            <div className={Style.value}>{data.amount === -1 ? '无上限' : data.amount}</div>
                            </div>
                        <div className={Style.btn}>
                           <Button type="primary">立即报名</Button>
                        </div>
                    </div>
                </div>
              
                <div className={Style.bottom}> 
                 <Card>
                    <div className={Style.title}>{data.name}</div>
                    <div className={Style.bottomInfo}>
                    <div className={Style.root}>联系人: {data.contact}</div>
                    <div className={Style.root}>联系方式: {data.tel}</div>
                    </div>
                 {data.content ? <div className={Style.detailContent} dangerouslySetInnerHTML={{__html: data.content}} ></div> : 
                  <Empty
                        style={{margin: '20px 0'}}
                        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                        imageStyle={{
                        height: 100,
                        }}
                        description={<span>暂无活动详情</span>}></Empty> 
                } 
                </Card>
                </div>
            </div>
          </Modal>
          }
        </div>  
        )
    }
}

export default ActivityDetail