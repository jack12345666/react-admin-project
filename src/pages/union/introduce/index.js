import React, { Component } from 'react'
import { connect } from 'dva'
import { Row, Col, Divider, Button, Input, message } from 'antd'
import MyUpload from '@/components/uploadImg'
import Editor from '@/components/editor/Editor'
import { BASEURL } from '@/utils/config'
import { imgFormat } from '@/utils/utils'
import style from './index.scss'

const namespace = 'union'
@connect(({ union }) => ({ union }))
class Introduce extends Component {
    state = {
        description: '',
        logo: '',
        logoUrl: '',
        name: '',
        id: null,
        displayno: null,
        category: null,
        presidentorgid: null,
        presidentorguserid: null,
        operators:[],
    }
    introduceEditor = React.createRef()
    componentDidMount() {
        setTimeout(() => {
            if (localStorage.getItem('alliance')) {
                this.props.dispatch({
                    type: `${namespace}/fetchUnionDetail`,
                    payload: localStorage.getItem('alliance')
                }).then(() => {
                    const { unionDetail } = this.props[namespace]
                    const operatorsList = []
                    if(unionDetail && unionDetail.operators.length > 0){
                        unionDetail.operators.forEach(item=>{
                            operatorsList.push({'orgId': item['orgId'], 'orgUserId': item['orgUserId'] })
                        })
                    }
                    this.setState({
                        description: unionDetail && unionDetail.description  ? unionDetail.description : '<p></p>',
                        logoUrl: unionDetail ? imgFormat(unionDetail.logopath) : '',
                        logo: unionDetail ? unionDetail.logopath : '',
                        name: unionDetail ? unionDetail.name : '',
                        id: unionDetail ? unionDetail.id : null,
                        displayno: unionDetail ? unionDetail.displayno : null,
                        category: unionDetail ? unionDetail.category : null,
                        presidentorgid: (unionDetail && unionDetail.presidentorgid) ? unionDetail.presidentorgid : null,
                        presidentorguserid: (unionDetail && unionDetail.presidentorguserid) ? unionDetail.presidentorguserid : null,
                        operators:JSON.stringify(operatorsList) 
                    })
                })
            } else {
                this.setState({
                    description: '<p></p>'
                })
            }
        }, 500)
    }

    changeName = ({ target: { value } }) => {
        this.setState({
            name: value
        })
    }

    uploadLogo = data => {
        this.setState({
            logoUrl: BASEURL + data,
            logo: data
        })
    }

    saveOrUpdate = () => {
        const { name, logo, description, category, displayno, id, presidentorgid, presidentorguserid, logoUrl, operators } = this.state
        if (!logo) {
            message.error('请上传联盟LOGO')
            return
        } else if (this.introduceEditor.current.getEditorValue() === '<p></p>' || !this.introduceEditor.current.getEditorValue()) {
            message.error('请填写联盟简介')
            return
        } else {
            console.log(this.introduceEditor.current.getEditorValue())
            let data = {
                category,
                displayno,
                name,
                description: this.introduceEditor.current.getEditorValue() === '<p></p>' ? description : this.introduceEditor.current.getEditorValue(),
                id,
                logopath: logo,
                presidentorgid,
                presidentorguserid,
                operators
            }
            this.props.dispatch({
                type: `${namespace}/toEditUnionInfo`,
                payload: data
            }).then(rsp => {
                if(rsp && rsp.code === 0) {
                    message.success('联盟信息编辑成功！')
                    localStorage.setItem('allianceLogo', logoUrl) 
                    // window.location.reload()
                }
            })
        }
    }
    render() {
        const { logoUrl, description, name } = this.state
        return (
            <div>
                <Row gutter={16}>
                    <Col span={24}>
                        <Divider plain orientation="left">联盟简介</Divider>
                        <div className={style.item} style={{ alignItems: 'center' }}>
                            <div className={style.label}>联盟名称</div>
                            <div className={style.value}>
                               {localStorage.getItem('isPresident') == 1 ?
                                <Input value={name} disabled={true} placeholder="请输入名称" onChange={this.changeName} /> : 
                                <div style={{fontSize: '16px'}}>{name}</div>
                               }
                            </div>
                        </div>
                        <div className={style.item}>
                            <div className={style.label}>联盟LOGO</div>
                            <div className={style.value}>
                            {localStorage.getItem('isPresident') == 1 ? <MyUpload imgUrl={logoUrl} fn={this.uploadLogo} width={100} height={100} /> : <img src={logoUrl} style={{width: '100px', height: '100px'}} />}
                            </div>
                        </div>
                        <div className={style.item}>
                            <div className={style.label}>联盟介绍</div>
                        {localStorage.getItem('isPresident') == 1 ? <div className={style.value}>
                            {description && <Editor id={'introduceEditor'} value={description} width={'100%'} height={'240'} ref={this.introduceEditor} />}
                        </div> : 
                         <div className={style.value} dangerouslySetInnerHTML={{__html: description}}></div>
                        }
                        </div>
                    {localStorage.getItem('isPresident') == 1 && <div className={style.btns}>
                        <Button type="primary" onClick={this.saveOrUpdate}>保存</Button>
                    </div>}
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Introduce