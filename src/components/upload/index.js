import React, {Component } from 'react'
import { Upload, message } from 'antd'
import './index.scss'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { uploadFile } from '@/services/common'
import { BASEURL, LIMITFILE } from '@/utils/config'
import { imgFormat } from '@/utils/utils'

class MyUpload extends Component {
   state = {
     fileList: [],
     delFileList: []
   }
   componentWillReceiveProps(nextProps) {
    const { imgList } = nextProps
    this.setState({
        fileList: imgList
    })
   }

    beforeUpload = file => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('请上传jpg或者png格式的图片');
    }
    const isLtM = file.size / 1024 / 1024 < LIMITFILE;
    if (!isLtM) {
      message.error(`图片最大不超过${LIMITFILE}M`);
    }
    return isJpgOrPng && isLtM;
  }


   onRemoveImg = (file) => {
       const { fn } = this.props
       const { delFileList, fileList } = this.state
       let delArr = delFileList
       delArr.push(file.id)
       this.setState({
           delFileList: delArr
       })
       fn(fileList, delFileList)
   }
   
   handleChange = ({fileList}) => {
       const { fn } = this.props
       const { delFileList } = this.state
       this.setState({
           fileList
       })
       fn(this.state.fileList, delFileList)
   }

    toUpload = data => {
        const { fn } = this.props
        let formData = new window.FormData() 
        formData.append("files", data.file);
        uploadFile(formData).then(rsp => {
            if(rsp && rsp.length > 0) {
                message.success('上传成功') 
                const { fileList, delFileList } = this.state
                let imgsList  = fileList
                if(imgsList.length > 0) {
                    imgsList.forEach((item, index) => {
                        if(item.status) {
                            imgsList.splice(index, 1)
                        }
                    })
                }
                imgsList.push({uid: parseInt(new Date().getTime()), url: BASEURL + rsp[0].filePath, id: rsp[0].id})   
                fn(imgsList, delFileList)
            }
        })
    }

   render() {
       let loading = false
       const uploadButton = (
         <div style={{padding:　'50px'}}>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div>上传照片</div>
         </div>
       )
       const { limit } = this.props
       const { fileList } = this.state
        return (
            <div className="clearfix">
              <Upload
                name="files"
                data={{ type: 'images'}}
                accept="image/*"
                listType="picture-card"
                showUploadList={true}
                onRemove={this.onRemoveImg}
                onChange={this.handleChange}
                beforeUpload={this.beforeUpload}
                fileList={fileList}
                customRequest={this.toUpload}
             >  
                { fileList.length >= limit ? null : uploadButton }  
            </Upload>
        </div> 
        )
    }
}

export default MyUpload