import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';


class Photodetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgsrc: `null`,
            width: 0,
            height: 0,
            title: '',
            des: '',
            owner: `null`,
            comments: 0,
            faves: 0,
            views: 0,
            tags: [],

        };
    }

    getInfo() {
        var context = this;
        var id = this.props.match.params.id;
        var url = `https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=2967edc0cbc11415bdd32aa62f19f688&photo_id=${id}&format=json&nojsoncallback=1`;
        axios
            .get(url)
            .then(response => {
                var jsondata = response.data.photo;
                var imgsrc = `https://farm${jsondata.farm}.staticflickr.com/${jsondata.server}/${jsondata.id}_${jsondata.secret}.jpg`;
                var img = new Image();
                img.onload = function () {
                    context.setState({
                        imgsrc,
                        width: this.width,
                        height: this.height,
                        title: jsondata.title._content,
                        des: jsondata.description._content,
                        owner: jsondata.owner,
                        views: jsondata.views,
                        comments: jsondata.comments._content,
                        tags: jsondata.tags.tag
                    })
                }
                img.src = imgsrc

            })
    }
    handleOnClick(text) {
        this.props.history.push(`/search=` + text)
    }
    componentDidMount() {
        this.getInfo();
    }

    render() {
        const {
            imgsrc,
            width,
            height,
            title,
            des,
            owner,
            comments,
            faves,
            views,
            tags,
        } = this.state;
        var style = {
            width: width,
            height: height,
        }
        var avatar = { backgroundImage: 'url(' + `http://farm${owner.iconfarm}.staticflickr.com/${owner.iconserver}/buddyicons/${owner.nsid}.jpg` + ')' }
        return (
            <div className="view" >
                <div className="media-scrappy-view" >
                    <img style={style} src={imgsrc} className="main-photo" alt="Red | by Sunny M5">
                    </img>
                </div>
                <div className="fluid-centered"  >
                    <div className="sub-info-view">
                        <div className="attr-info">
                            <div className="owner-avatar" style={avatar} />
                            <a className="owner-name">{owner.username}</a>
                            <div className="photo-info">
                                <h4 className="photo-title">{title}</h4>
                                <div className="photo-desc">{des}</div>

                                <div className="stats-view" >
                                    <div className="view-count">
                                        <span className="view-count-label">
                                            {views}</span>
                                        <span className="stats-label">views</span>
                                    </div>

                                    <div className="fave-count">
                                        <span className="fave-count-label">
                                            {faves}
                                        </span>
                                        <span className="stats-label">faves</span>
                                    </div>

                                    <div className="comment-count">
                                        <span className="comment-count-label">
                                            {comments}</span>
                                        <span className="stats-label">comments</span>
                                    </div>
                                </div>
                                <div className="tag-view">
                                    <h4>Tags</h4>
                                    <ul className="tags-list">
                                        {tags.map((tag, index) => {
                                            return <li className="tag"
                                                onClick={() => this.handleOnClick(tag.raw)}
                                                key={index}>{tag.raw}</li>
                                        })}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

        );
    }
}

export default Photodetail;