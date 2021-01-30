import React, { Component } from 'react'
import { connect } from 'dva'
import { Row, Col, Tooltip, Pagination, Empty, message } from 'antd'
import { MenuUnfoldOutlined } from '@ant-design/icons'
import UnionRank from './unionRank'
import ScoreList from './scoreList'
import { imgFormat } from '@/utils/utils'
import style from './index.scss'

const namespace = 'rank'
@connect(({ rank }) => ({ rank }))
class Rank extends Component {
    state = {
        currentOrgRank: {
            companyId: null,
            order: null,
            companyName: '',
            score: null,
            logoPath: ''
        },
        showOrgDetail: false,
    }

    componentDidMount() {
        const { orgRankConf } = this.props[namespace]
        const { currentOrgRank } = this.state
        orgRankConf.pageSize = 1000
        this.props.dispatch({
            type: `${namespace}/changeOrgRankConf`,
            payload: orgRankConf
        })
        this.props.dispatch({
            type: `${namespace}/fetchOrgRankList`
        }).then(() => {
            const { orgRankList } = this.props[namespace]
            this.setState({
                currentOrgRank: orgRankList.length > 0 ? orgRankList.filter(item => item.companyId == localStorage.getItem('orgId'))[0] : currentOrgRank
            })
            orgRankConf.pageSize = 10
            this.props.dispatch({
                type: `${namespace}/changeOrgRankConf`,
                payload: orgRankConf
            })
            this.props.dispatch({
                type: `${namespace}/fetchOrgRankList`
            })
        })
       
    }

    changeOrgInfo = item => {
        const { scoreConf } = this.props[namespace] 
        this.setState({
            currentOrgRank: item 
        })
        scoreConf.companyId = item.companyId
        this.props.dispatch({
            type: `${namespace}/changeScoreConf`,
            payload: scoreConf
        })
        this.props.dispatch({
            type: `${namespace}/fetchScoreList`
        }).then(() => {
            this.setState({
             showOrgDetail: true 
        }) 
      })
    }

    seeScoreDetail = () => {
        const { scoreConf } = this.props[namespace]
        scoreConf.companyId = localStorage.getItem('orgId')
        this.props.dispatch({
            type: `${namespace}/changeScoreConf`,
            payload: scoreConf
        })
        this.props.dispatch({
            type: `${namespace}/fetchScoreList`
        }).then(() => {
            this.setState({
             showOrgDetail: true 
        }) 
      })
    }

    closeScoreBox = () => {
        this.setState({
            showOrgDetail: false
        })
    }

    onChangePage = page => {
        const { orgRankConf } = this.props[namespace]
        orgRankConf.currentPage = page
        this.props.dispatch({
            type: `${namespace}/changeOrgRankConf`,
            payload: orgRankConf
        })
        this.props.dispatch({
            type: `${namespace}/fetchOrgRankList`
        })
    }

    render() {
        const { currentOrgRank, showOrgDetail } = this.state
        const { orgRankList, orgRankConf, orgRankTotal, scoreList } = this.props[namespace]
        return (
            <Row gutter={20}>
                <Col span={9}>
                   <UnionRank />
                </Col>
                <Col span={15}>
                  <div className={style.title}>联盟内单位排名</div>
                  <div className={style.myOrgBox}>
                    <div className={style.item}>
                        <div className={style.label}>我的单位排名</div>
                        <div className={style.rvalue}>{currentOrgRank.order}</div>
                    </div>
                    <div className={style.item}>
                        <div className={style.label}>
                            <img alt="default" src={imgFormat(currentOrgRank.logoPath) || require('@/assets/default.png')}/>
                        </div>
                        <div className={style.value}>{currentOrgRank.companyName}</div>
                    </div>
                    <div className={style.item}>
                        <div className={style.label}>我的单位积分</div>
                        <div className={style.rvalue}>{currentOrgRank.score}</div>
                    </div>
                    <div className={style.item}>
                      <MenuUnfoldOutlined  style={{color: '#F2994A', fontSize: '24px'}} onClick={this.seeScoreDetail}/>
                    </div>
                </div>
               { showOrgDetail ?
                  <ScoreList closeScoreBox={this.closeScoreBox} scoreList={scoreList}/>
                : <div className={style.orgRankList}>
                 {orgRankList.map(item => (
                        <div className={style.rankItem} key={item.companyId}>
                       {item.order <= 3 && <div className={style.rank}>
                            <img src={require(`@/assets/rank${item.order}.png`)}/>
                        </div>}
                       { item.order > 3 && <div className={style.rank}>{item.order}</div>}
                        <div className={style.logo}>
                            <img src={imgFormat(item.logoPath) || require('@/assets/default.png')}/>
                        </div>
                       <div className={style.name}> 
                        <Tooltip placement="top" title={item.companyName}>
                           {item.companyName}
                        </Tooltip>
                        </div>
                       <div className={style.score}>{item.score}</div>
                      {localStorage.getItem('isPresident') == 1 && <div className={style.options}> 
                          <MenuUnfoldOutlined  style={{ color: '#F2994A', fontSize: '20px'}} onClick={() => {this.changeOrgInfo(item)}}/>
                       </div>}
                    </div>
                    ))}
                    {orgRankList.length > 0 ? 
                      <Pagination style={{textAlign: 'center', marginTop: '10px'}} current={orgRankConf.currentPage} pageSize={orgRankConf.pageSize} onChange={this.onChangePage} total={orgRankTotal} />
                    : <Empty />
                  }
                </div>
                }

                </Col>
            </Row>
        )
    }
}

export default Rank