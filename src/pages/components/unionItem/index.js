import React, { Component } from 'react'
import { Modal } from 'antd'
import { BASEURL } from '@/utils/config'
import style from './index.scss'


class UnionItem extends Component {
    state = {
        title: '',
        description: '',
        logoUrl: '',
        time: '',
        fileList: [],
        displayno: null,
    }
    componentDidMount() {
        const { detailData } = this.props
        if(detailData) {
            this.setState({
                title: detailData.title,
                description: detailData.description,
                logoUrl: BASEURL + detailData.picpath,
                displayno: detailData.displayno,
                time: detailData.eventtime,
                fileList: detailData.attachmentList 
            })
        }
    }
    render() {
        const { boxTitle, closeBox } = this.props
        const { title, description, logoUrl, time, fileList } = this.state
        return (
          <Modal
            width="800px"
            title={boxTitle}
            onCancel={closeBox}
            maskClosable={false}
            visible={true}
            footer={null}
           > 
           <div className={style.box}>
            <div className={style.item}>
                <div className={style.label}>标题</div>
                <div className={style.value}>{title}</div>
            </div>
            {
              boxTitle === '联盟动态' ? null :
              <div className={style.item}>
                <div className={style.label}>封面</div>
                <div className={style.value}>
                    <img src={logoUrl} width="200px" height="200px"/>
                </div>
              </div>    
            }
            <div className={style.item}>
                <div className={style.label}>时间</div>
                <div className={style.value}>{time}</div>
            </div>
            <div className={style.item}>
                <div className={style.label}>描述</div>
                <div className={style.value} dangerouslySetInnerHTML={{__html: description}}></div>
            </div>
            <div className={style.item}>
                <div className={style.label}>附件</div>
                <div className={style.value}>
                    {
                        fileList.map(item => (
                            <div key={item.id}>
                                <a href={BASEURL + item.filePath}>{item.fileName}</a>
                            </div>
                        ))
                    }
                </div>
            </div>
          </div> 
         </Modal>
        )
    }
}

export default UnionItem