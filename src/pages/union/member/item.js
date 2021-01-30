import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Select, InputNumber, Spin, Tag, message, Button } from 'antd'
import debounce from 'lodash/debounce';
import style from './index.scss'

const namespace = 'member'
const { Option } = Select
@connect(({ member }) => ({ member }))
class MemberItem extends Component {
    state = {
        alliance: null,
        displayno: null,
        orgid: null,
        searchName: '',
        fetching: false,
        searchOrgList: [],
        checkOrgName: '',
    }
    onChange = value => {
        this.setState({
            displayno: value
        })
    }

    fetchOrg = value => {
        this.props.dispatch({
            type: `${namespace}/changeOrgList`,
            payload: []
        })
        this.setState({
            fetching: true
        })
        const { orgConf } = this.props[namespace]
          orgConf.nameLike = value
          orgConf.currentPage = 1
          this.props.dispatch({
              type: `${namespace}/changeOrgConf`,
              payload: orgConf
          })
          this.props.dispatch({
              type: `${namespace}/fetchOrgList`
          }).then(() => {
              const { orgList } = this.props[namespace]
              this.setState({
                searchOrgList: orgList,
                fetching: false, 
              })
          })
    }

    handleOk = () => {
        const { closeBox } = this.props
        const {displayno, orgid} = this.state
        let data = {
            alliance: localStorage.getItem('alliance'),
            orgid,
            displayno
        }
        if(!displayno) {
            message.error('请填写显示顺序')
            return
        }else if(!orgid) {
            message.error('请选择添加的单位')
        }else {
           this.props.dispatch({
               type: `${namespace}/saveAllianceOrg`,
               payload: data
           }).then(rsp => {
               if(rsp && rsp.code === 0) {
                   message.success('新增成功！')
                   closeBox()
                   this.props.dispatch({
                       type: `${namespace}/fetchMemberList`
                   })
               }
           })
        }
    }

    orgScroll = e => {
        this.setState({
            fetching: true
        })
        e.persist();
        const { target } = e;
        if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
          const { orgConf } = this.props[namespace]
          orgConf.currentPage = orgConf.currentPage + 1
          this.props.dispatch({
              type: `${namespace}/changeOrgConf`,
              payload: orgConf
          })
          this.props.dispatch({
              type: `${namespace}/fetchOrgList`
          }).then(() => {
              const { orgList } = this.props[namespace]
              this.setState({
                searchOrgList: orgList,
                fetching: false, 
              })
          })
        }
      }

    checkOrg = value => {
    this.setState({
        orgid: value.key,
        checkOrgName: value.label
        })
    }

    onBlur = () => { 
        this.setState({
            searchOrgList: [],
        }) 
        this.props.dispatch({
            type: `${namespace}/changeOrgList`,
            payload: []
        })   
    }
 
    render() {
        const { closeBox } = this.props
        const { displayno, fetching, searchOrgList, checkOrgName } = this.state
        let footerObj =  [
            <Button onClick={closeBox} className={style.defaultBtn}>取消</Button>,
            <Button type="primary" onClick={this.handleOk.bind(this)}>确定</Button>
          ]

        return (
            <Modal
             width={600}
             title={'新增成员'}
             onCancel={closeBox}
             visible={true}
             footer={footerObj}
            >
            <div className={style.editBox}>
              <div id="org" className={style.item}>
                  <div className={style.label}>机构名称</div>
                  <div className={style.value}>
                    <Select
                      showSearch
                      style={{width: '300px'}}
                      placeholder="请输入机构名称关键词"
                      labelInValue
                      notFoundContent={fetching ? <Spin size="small" /> : null}
                      onSearch={debounce(this.fetchOrg, 800)}
                      onChange={this.checkOrg}
                      onBlur={this.onBlur}
                      onPopupScroll={this.orgScroll}
                      filterOption={false}
                      getPopupContainer={() => document.getElementById('org')}
                    >
                        {searchOrgList.length > 0 &&
                         searchOrgList.map((item, index)=> (
                          <Option value={item.id} key={index}>
                            {item.name}
                          </Option>                        
                         ))}
                    </Select>
                  </div>
              </div> 
              {checkOrgName && 
              <div className={style.item}>
                 <div className={style.label}>添加机构</div>
                 <Tag color="#CF4343">{checkOrgName}</Tag>
               </div>
              }
              <div className={style.item}>
                  <div className={style.label}>显示顺序</div>
                  <div className={style.value}>
                    <InputNumber style={{width: '150px'}} min={0} value={displayno} onChange={this.onChange} />
                  </div>
              </div> 
            </div>
          </Modal>
        )
    }
}

export default MemberItem