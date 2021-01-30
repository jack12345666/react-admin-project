import React, { Component } from 'react';
import Style from './style.scss'

class Footer extends Component {
    render() {
        return (
            <div className={Style.box}>
            <div className={Style.footerBox}>
                <div className={Style.footerLeft}>
                    <div>
                    <div className={Style.callWe}>联系我们</div>
                    <div className={Style.phone}>
                         <img
                          style={{width: '14.86px', height: '16px', marginRight: '5px'}}
                          alt={'phone'}
                          src={require('../../assets/phone.png')}
                          />
                        联系电话: 0517-82987316</div>
                    <div className={Style.address}>
                         <img
                          style={{width: '14.86px', height: '16px', marginRight: '5px'}}
                          alt={'adress'}
                          src={require('../../assets/adress.png')}
                          />
                        杭州钱塘新区行政服务中心（江东大道3899号）</div>
                </div>
                </div>
                <div className={Style.footerRight}>
                    <div>
                    <div className={Style.show}>网站公司</div>
                    <div className={Style.beian}><a href="http://beian.miit.gov.cn/">浙ICP备20002178号-1</a></div>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}

export default Footer;