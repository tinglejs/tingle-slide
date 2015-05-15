import React from 'react';
import Icon from 'tingle-icon';

class PhotoField extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            className: props.className,
            photoUrl:  props.photoUrl,
            label:     props.label,
            icon:      props.icon
        }    
    }

    showPhotoUtil() {
        var t = this;
        WindVane.call('WVCamera', 'takePhoto', {
            'type': '0'
        }, function(e1) {
            WindVane.call('WVCamera', 'confirmUploadPhoto', {
                path: e1.localPath
            }, function(e2) {
                alert(JSON.stringify(e2, null, 2));
                t.setState({
                    photoUrl: e2.resourceURL
                });
            }, function() {
                alert('上传失败！');
            });
        }, function(e) {});
    }

    showPhoto() {}

    render() {
        var t = this;
        return (
            <div className={"tPhotoField tFBH tFBAC tPR4 " + t.state.className}>
                <div className="tMR10">{t.state.label}</div>
                <div className="tFB1 tFBH tFBAC tFBJE">
                    {
                        t.state.photoUrl
                        ? <img className="tPhotoFieldPreview"
                          src={t.state.photoUrl}
                          onClick={t.showPhoto.bind(this)}/>
                        : ''
                    }
                    <div className="tPhotoFieldIcon tML4"
                     onClick={t.showPhotoUtil.bind(this)}>
                        <Icon name={t.state.icon}/>
                    </div>
                </div>
            </div>
        );
    }
}

PhotoField.defaultProps = {
    photoUrl: ''
}

export {PhotoField};