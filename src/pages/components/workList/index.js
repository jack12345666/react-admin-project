import React, { Component } from 'react'
import { connect } from 'dva'
import { Tag, Empty, Popconfirm, message, Tooltip } from 'antd'
import style from './index.scss'
import { imgFormat } from '@/utils/utils'

const namespace = 'work'
@connect(({work}) => ({work}))
class WorkList extends Component {
    toDetail = item => {
        this.props.dispatch({
            type: `${namespace}/changeWorkDetail`,
            payload: item
        })
        window.location.href = window.location.href.substring(0, window.location.href.length - window.location.hash.length) + '#/redUnion/workDetail'
    }

    toDel = (item, e) => {
        e.stopPropagation()
        const { refreash } = this.props
        this.props.dispatch({
            type: `${namespace}/toDeteleUnionWork`,
            payload: item.id
        }).then(rsp => {
            if(rsp && rsp.code === 0) {
                message.success('删除成功')
                refreash()
            }
        })
    }

    toChange = (item, e) => {
        e.stopPropagation()
        this.props.dispatch({
            type: `${namespace}/changeWorkDetail`,
            payload: item
        })
        window.location.href = window.location.href.substring(0, window.location.href.length - window.location.hash.length) + '#/redUnion/editWork'
    }

    render() {
        const { workList, isImg } = this.props
        return (
            <>
            <div className={style.list}>
                {!isImg &&
                   workList.map((item, index) => (
                    <div className={style.listItem} key={index} onClick={() => {this.toDetail(item)}}>
                    <div className={style.info}>
                      {item.month ? <div className={style.title}>{item.year}年{item.month}月月度{item.typeStr}</div> : 
                      <div className={style.title}>{item.year}年{item.typeStr}</div>
                      }
                        <div className={style.content}>
                            {item.description}
                        </div>
                        <div className={style.bottomInfo}>
                            <span className={style.font}>{item.operatorName}</span>
                            <span className={style.font}>{item.postTime}</span>
                            <span className={style.font}><Tag color="#CF4343">{item.typeStr}</Tag></span>
                        </div>
                    </div>
                </div>
                   )) 
                }

               {isImg &&
                workList.map((item, index) => (
                    <div className={style.listItem} key={index} onClick={() => {this.toDetail(item)}}>
                   <div className={style.img}>
                        <img src={imgFormat(item.coverPic)}/>
                    </div>
                    <div className={style.info}>
                        <div className={style.infoTop}>
                          <div className={style.topTitle}>{item.title}
                          {item.checkStatus === 2 && 
                           <Tooltip placement="top" title={`原因：${item.checkCont}`}>
                              <Tag color="error" style={{marginLeft: '10px'}}>审核驳回</Tag>
                            </Tooltip>
                          }
                          {item.checkStatus === 0 &&  <Tag color="processing" style={{marginLeft: '10px'}}>待审核</Tag>}
                          </div>
                       {item.checkStatus === 2 && <Popconfirm
                                title="确定要删除此特色工作?"
                                onConfirm={(e) => this.toDel(item, e)}
                                onCancel={e => e.stopPropagation()}
                                okText="确定"
                                cancelText="取消"
                            >
                          <div className={style.options} onClick={e => e.stopPropagation()}>删除</div>
                          </Popconfirm>}
                          {item.checkStatus === 2 && <div className={style.options} onClick={(e) => this.toChange(item, e)}>修改</div>}
                      </div>
                        <div className={style.content}>
                            {item.description}
                        </div>
                        <div className={style.bottomInfo}>
                            <span className={style.font}>{item.operatorName}</span>
                            <span className={style.font}>{item.createTime}</span>
                            <span className={style.font}><Tag color="#CF4343">{item.categoryStr}</Tag></span>
                        </div>
                    </div>
                </div>
                 )) 
                }
            </div>
            {workList.length === 0 && <Empty style={{marginTop: '100px'}}/>}
            </>
        )
    }
}

export default WorkList