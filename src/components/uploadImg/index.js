import React from 'react';
import { Upload, message } from 'antd';
import './index.scss'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { uploadFile } from '@/services/common'
import { LIMITFILE } from '@/utils/config'

const MyUpload = ({ type = "image", imgUrl="", width = 180, height = 180, fn }) => {
    let loading = false;
    const uploadButton = (
        <div style={{padding: '50px'}}>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div className="ant-upload-text">上传照片</div>
        </div>
    )

    function beforeUpload(file) {
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
    

    function toUpload(data) {
        let formData = new window.FormData() 
        formData.append("files", data.file);
        uploadFile(formData).then(rsp => {
            if(rsp && rsp.length > 0) {
                message.success('上传成功')    
                fn(rsp[0].filePath)
            }
        })
    }
    return (
        <div >
            <Upload
                name="content"
                data={{
                    type: type
                }}
                accept="image/*"
                listType="picture-card"
                showUploadList={false}
                customRequest={toUpload}
                beforeUpload={beforeUpload}
            >
                {imgUrl ? <img src={imgUrl} alt="avatar" style={{ width: width, height: height }} /> : uploadButton}
            </Upload>
        </div>
    )
}

export default MyUpload;