import React, { Component } from 'react'
import { connect } from 'dva'
import { Button, Tag } from 'antd'
import style from './index.scss'
import { imgFormat } from '@/utils/utils'

const namespace = 'work'
@connect(({ work }) => ({ work }))
class WorkDetail extends Component {
    goBack = () => {
        this.props.history.go(-1)
    }
    render() {
        const { workDetail } = this.props[namespace]
        return (
            <div>
             {workDetail && !workDetail.category &&
              <>
              <Button type="primary" size="small" onClick={this.goBack}>返回</Button>
              {workDetail.month ? 
               <div className={style.title}>{workDetail.year}年{workDetail.month}月月度{workDetail.typeStr}</div>
              : <div className={style.title}>{workDetail.year}年度{workDetail.typeStr}</div>
              } 
              <div className={style.info}>
                  <span>{workDetail.operatorName}</span>
                  <span>{workDetail.postTime}</span>
                </div> 
                <div className={style.content}>
                    {workDetail.description}
                </div>
              </>
              }
              {workDetail && workDetail.category &&
              <>
              <Button type="primary" size="small" onClick={this.goBack}>返回</Button>
               <div className={style.title}>{workDetail.title}</div>
               <div className={style.info}>
                  <span>{workDetail.operatorName}</span>
                  <span>{workDetail.createTime}</span>
                  <Tag color="#CF4343" style={{padding: '0 5px'}}>{workDetail.categoryStr}</Tag>
                </div> 
                  <div className={style.img}>
                     <img src={imgFormat(workDetail.coverPic)}/>
                </div>
                <div className={style.item}>
                    <div className={style.label}>开始时间</div>
                    <div className={style.value}>{workDetail.eventBeginTime}</div>
                </div>
                <div className={style.item}>
                    <div className={style.label}>结束时间</div>
                    <div className={style.value}>{workDetail.eventEndTime}</div>
                </div>
                {
                    (workDetail.category === '1003' || workDetail.category === '1005') && workDetail.gotoUrl &&
                    <div className={style.item}>
                        <div className={style.label}>外部链接</div>
                        <div className={style.value}><a href={workDetail.gotoUrl}>{workDetail.gotoUrl}</a></div>
                    </div>
                }
                {
                    workDetail.category === '1004' &&
                    <>
                     <div className={style.item}>
                    <div className={style.label}>拜访单位</div>
                    <div className={style.value}>{workDetail.visitedOrganization}</div>
                    </div>
                    <div className={style.item}>
                        <div className={style.label}>拜访结论</div>
                        <div className={style.value}>{workDetail.visitedResult}</div>
                    </div>
                    </>
                }    
                 {
                    workDetail.category === '1005' && workDetail.mediaChannel === 99 &&
                     <div className={style.item}>
                        <div className={style.label}>渠道名称</div>
                        <div className={style.value}>{workDetail.channelName}</div>
                     </div>
                }  
                {
                    workDetail.category === '1005' && workDetail.mediaChannel === 1 &&
                     <div className={style.item}>
                        <div className={style.label}>渠道名称</div>
                        <div className={style.value}>{'钱塘先锋'}</div>
                     </div>
                }    
                <div className={style.content}>
                    {workDetail.description}
                </div>
              </>
              }
            </div>
        )
    }
}

export default WorkDetail