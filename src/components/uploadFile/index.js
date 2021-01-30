import React, { Component } from 'react'
import { Upload, Button, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { uploadFile } from '@/services/common'
import { LIMITFILE } from '@/utils/config'

class UploadFile extends Component {
    state = {
      fileList: [],
      delFileList: [],
      currentList: [],
    }
    componentWillReceiveProps(nextProps) {
      const { fileList } = nextProps
      this.setState({
          fileList
      })
     }

    uploadFile = info => {
      let formData = new window.FormData() 
      formData.append("files", info.file);
      uploadFile(formData).then(rsp => {
          if(rsp && rsp.length > 0) {
              message.success('上传成功')
              const { fileList, delFileList, currentList } = this.state
                let fileArr  = fileList
                if(fileArr.length > 0) {
                    fileArr.forEach((item, index) => {
                        if(item.status) {
                            fileArr.splice(index, 1)
                        }
                    })
                }  
              fileArr.push({uid: +Math.random().toString().slice(-6), url: rsp[0].filePath, name: rsp[0].fileName, id: rsp[0].id})   
              currentList.push({uid: +Math.random().toString().slice(-6), url: rsp[0].filePath, name: rsp[0].fileName, id: rsp[0].id})  
              this.props.fn(fileArr, delFileList, currentList)  
          }
      })
    }

    beforeUpload = file => {
      const isLtM = file.size / 1024 / 1024 < LIMITFILE;
      if (!isLtM) {
        message.error(`附件最大不超过${LIMITFILE}M`);
      }
      return isLtM;
    }

    handleChange = ({fileList}) => {
      const { fn } = this.props
      const { delFileList, currentList } = this.state
      this.setState({
          fileList: fileList.slice()
      })
      fn(this.state.fileList, delFileList, currentList)
    }

    onRemoveImg = (file) => {
      console.log(file)
      const { fn } = this.props
      const { delFileList, currentList } = this.state
      let delArr = delFileList
      delArr.push({uid: file.uid, url: file.url, name: file.name, id: file.id})
      this.setState({
          delFileList: delArr
      })
      fn(this.state.fileList, delFileList, currentList)
  }

    render() {
        const props = {
            customRequest: this.uploadFile,
            onChange: this.handleChange,
            onRemove: this.onRemoveImg,
            beforeUpload: this.beforeUpload,
            showUploadList: true,
          }  
        const { fileList } = this.state
        if(fileList.length > 0) {
           fileList.forEach((item, index)=> {
                if(item.status) {
                  fileList.splice(index, 1)
              }
          })
        }
        return (
            <Upload {...props} fileList={fileList}>
            <Button>
              <UploadOutlined /> 上传附件
            </Button>
          </Upload>
        )
    }
}

export default UploadFile