import React, {Component } from 'react';

export default class Editor extends Component {

    constructor(props) {
        super(props)
        this.state = {
            ueEditor: null,
            editorValue: '<p></p>'
        }
        this.editorRef = React.createRef();
    }

    componentDidMount() {
        var UE = window.UE;
        let { id, height, value } = this.props;
        if (id) {
            try {
                UE.delEditor(id);
            } catch (error) { }
            let ueEditor = UE.getEditor(id, {
                initialFrameHeight: height || 360,
                serverUrl: '',
                initialFrameWidth: '100%',
                enableAutoSave: false,
                autoFloatEnabled:false,
            });
            this.setState({ 
                ueEditor
             })

             ueEditor.ready(() => {
                let defaultValue= value || '<p></p>';
                ueEditor.setContent(defaultValue);
                // setTimeout(() => {
                //      ueEditor.setContent(defaultValue);
                // }, 100)
             })
          
            //将文本回调回去
            ueEditor.addListener('selectionchange', (type) => {
                // this.props.callback(ueEditor.getContent())
                this.setState({
                    editorValue: ueEditor.getContent()
                })
            })
        }
    }

    getEditorValue = () => {
        return this.state.editorValue
    }


    render() {
        return (
            <div>
            <script id={this.props.id} ref={this.editorRef}></script>
           </div>

        )
    }
}