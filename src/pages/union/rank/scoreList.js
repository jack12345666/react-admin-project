import React, { Component } from 'react'
import { Empty } from 'antd'
import { CloseOutlined } from '@ant-design/icons';
import style from './index.scss'

class ScoreList extends Component {
    render() {
        const { closeScoreBox, scoreList } = this.props
        return (
            <div className={style.scoreList}>
                <div className={style.close}>
                   <CloseOutlined style={{fontSize: '18px'}} onClick={closeScoreBox} />
                </div>
                {scoreList.length > 0 ?
                   scoreList.map(item => (
                        <div className={style.scoreItem} key={item.id}>
                            <div className={style.reason}>{item.categoryStr}</div>
                            <div className={item.score > 0 ? style.score : style.lossScore}>{item.score > 0 ? `+${item.score}` : `${item.score}`}</div>
                        </div>
                   )) :
                   <Empty style={{marginBottom: '15px'}}/>
                }     
            </div>
        )
    }
}

export default ScoreList