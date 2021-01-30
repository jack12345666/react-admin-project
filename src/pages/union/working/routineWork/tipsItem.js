import React, { Component } from 'react'
import { BellOutlined } from '@ant-design/icons'
import { Button, Tag, Tooltip } from 'antd'
import { dateTimeFormat } from '@/utils/utils'
import style from './index.scss'

class TipsItem extends Component {
    toInput = item => {
        const { inputBox, onBack } = this.props
        onBack(item)
        inputBox()
    }
    render() {
        const { tipsList } = this.props
        return (
            <div className={style.tipsBox}>
                {tipsList.length > 0 &&  tipsList.map((item, index) => (
                    <div className={style.tipsItem} key={index}>
                    <div className={style.content}>
                     <BellOutlined style={{color: '#D81E06', marginRight: '5px'}}/>
                     <span className={style.text}>请在</span>
                     <span className={style.time}>{dateTimeFormat(item.postEnd)}点之前</span>
                     <span className={style.text}>填写</span>
                    {item.month ? <span className={style.work}>{item.month}月月度{item.typeStr}</span>
                    : <span className={style.work}>{item.year}年度{item.typeStr}</span>
                    }
                    {(item.description && item.checkStatus === 2 && item.status === 1) && 
                     <Tooltip placement="top" title={`原因：${item.checkCont}`}>
                       <Tag color="error" style={{marginLeft: '10px'}}>审核驳回</Tag>
                      </Tooltip>
                    }   
                    </div>
                    <div className={style.btn}>
                       {!item.description && <Button type="primary" size="small" onClick={() => {this.toInput(item)}}>填写</Button>} 
                       {(item.description && item.checkStatus === 0 && item.status === 0) && <Button type="primary" size="small" onClick={() => {this.toInput(item)}}>修改</Button>} 
                       {(item.description && item.checkStatus === 2 && item.status === 1) && <Button type="primary" size="small" onClick={() => {this.toInput(item)}}>修改</Button>} 
                       {(item.description && item.status === 1 && item.checkStatus === 0) && <Button type="primary" size="small" onClick={() => {this.toInput(item)}}>查看</Button>} 
                    </div>
                </div> 
                ))  
            } 
            </div>
        )
    }
}

export default TipsItem