import React, { Component } from 'react'
import { connect } from 'dva'
import { Tooltip } from 'antd'
import { imgFormat } from '@/utils/utils'
import style from './index.scss'
import ScoreList from './scoreList'

const namespace = 'rank'
@connect(({ rank }) => ({ rank }))
class UnionRank extends Component {
    state = {
        currentUnionRank: {
            alliance: null,
            allianceName: '',
            mainPath: null,
            logoPath: null,
            order: null,
            score: null
        },
        showScore: false,
    }
    
    componentDidMount() {
        const { currentUnionRank } = this.state
        this.props.dispatch({
            type: `${namespace}/fetchAllianceRankList`
        }).then(() => {
            const { allianceRankList } = this.props[namespace]
            this.setState({
                currentUnionRank: allianceRankList.length > 0 ? allianceRankList.filter(item => item.alliance == localStorage.getItem('alliance'))[0] : currentUnionRank
            })
        })
    }

    unionScoreDetail = () =>　{
        this.props.dispatch({
            type: `${namespace}/fetchUnionScoreList`
        }).then(() => {
           this.setState({
            showScore: true
         }) 
        })  
    }
 
    closeScoreBox = () => {
        this.setState({
            showScore: false
        })
    }
    render() {
        const { currentUnionRank, showScore } = this.state
        const { allianceRankList, unionScoreList } = this.props[namespace]
        return (
            <>
            <div className={style.title}>联盟排名</div>
            <div className={style.unionBox}>
                <div className={style.top}>
                <div className={style.myBox}>
                    <div className={style.item}>
                        <div className={style.label}>联盟排名</div>
                        <div className={style.rvalue}>{currentUnionRank.order}</div>
                    </div>
                    <div className={style.item}>
                        <div className={style.label}>
                            <img alt="default" src={imgFormat(currentUnionRank.logoPath) || require('@/assets/default.png')}/>
                        </div>
                        <div className={style.value} style={{fontSize: '15px'}}>{currentUnionRank.allianceName}</div>
                    </div>
                    <div className={style.item}>
                        <div className={style.label}>联盟积分</div>
                        <div className={style.rvalue}>{currentUnionRank.score}</div>
                    </div>
                </div>
                <div className={style.seeDetail} onClick={this.unionScoreDetail}>查看联盟工作得分明细</div>
               </div>  
               { showScore ?
                  <ScoreList closeScoreBox={this.closeScoreBox} scoreList={unionScoreList}/>
                : 
                <div className={style.rankList}>
                    {allianceRankList.map((item, index) => (
                        <div className={style.rankItem} key={item.alliance}>
                       {index <= 2 && <div className={style.rank}>
                            <img alt="default" src={require(`@/assets/rank${index+1}.png`) || require('@/assets/default.png')}/>
                        </div>}
                       {index > 2 && <div className={style.rank}>{index+1}</div>}
                        <div className={style.logo}>
                            <img alt="default" src={imgFormat(item.logoPath) || require('@/assets/default.png')}/>
                        </div>
                       <div className={style.name}> 
                        <Tooltip placement="top" title={item.allianceName}>
                           {item.allianceName}
                        </Tooltip>
                        </div>
                       <div className={style.score}>{item.score}</div>
                    </div>
                    ))}
                </div>}
            </div>
            </>
        )
    }
}

export default UnionRank