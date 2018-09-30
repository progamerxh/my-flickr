import React, { Component } from 'react';
import axios from 'axios';
import xml2js from 'xml2js';
import justifiedLayout from 'justified-layout';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    isLoading: true,
    photos: [],
    geometry: 1,
    error: null
  }

  getJustifiedLayout(tempphoto, tempratio) {
    var config = {
      containerWidth: 1002,
      boxSpacing: 5,
      targetRowHeight: 250,
      targetRowHeightTolerance: 0.25,
      maxNumRows: Number.POSITIVE_INFINITY,
      forceAspectRatio: false,
      showWidows: true,
      fullWidthBreakoutRowCadence: false
    }
    var geometry = justifiedLayout(tempratio.slice(0, 50), config)
    this.setState({
      photos: tempphoto,
      geometry: geometry,
      isLoading: false
    });
  }

  getPhotos() {
    var jsondata
    var context = this
    axios
      .get("https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=2967edc0cbc11415bdd32aa62f19f688&extras=owner_name,count_faves,count_comments&format=rest")
      .then(response => {
        xml2js.parseString(response.data, { mergeAttrs: true, explicitArray: false }, (err, result) => {
          jsondata = result.rsp.photos.photo
        });
        var tempphoto = []
        var tempratio = []
        var count = 0;
        jsondata.map(photo => {
          const { farm, server, secret, id, title, ownername, count_faves, count_comments } = photo;
          var imgsrc = `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}.jpg`;
          var img = new Image();
          img.onload = function () {
            tempratio.push(Number((this.width / this.height).toFixed(1)));
            tempphoto.push({ src: imgsrc, farm: farm, server: server, id: id, title: title, owner: ownername, faves: count_faves, comments: count_comments });
            if (++count === jsondata.length) {
              context.getJustifiedLayout(tempphoto, tempratio)
            }
          }
          img.src = imgsrc;
        })
      })
      .catch(error => this.setState({ error, isLoading: false }));
  }



  componentDidMount() {
    this.getPhotos();
  }

  render() {
    const { isLoading, geometry, photos } = this.state;
    var photoliststyle = { height: geometry.containerHeight }
    return (
      console.log(photos),
      <div className="fluid-centered" >
        <div className="tittle-row">
          <h3>Explore</h3>
          <div className="tools">
            <button className="justified"></button>
            <button className="story"></button>
          </div>
        </div>
        <div className="photo-list-view" style={photoliststyle}>
          {!isLoading ? (
            geometry.boxes.map((box, index) => {
              var style = {
                width: box.width,
                height: box.height,
                backgroundImage: 'url(' + photos[index].src + ')',
                transform: 'translate(' + box.left + 'px' + ',' + box.top + 'px' + ')',
                WebkitTransform: 'translate(' + box.left + 'px' + ',' + box.top + 'px' + ')',
                MsTransform: 'translate(' + box.left + 'px' + ',' + box.top + 'px' + ')',
              }
              return (
                <div key={index} className="hvrbox hvrbox_background box" style={style}>
                  <div className="hvrbox-layer_top">
                    <div className="hvrbox-text">
                      <div className="title">{photos[index].title}</div>
                      <div className="attr">by {photos[index].owner}</div>

                    </div>
                    <div className="engagement">
                      <span className="engagement-item fave" role="button" aria-label="Add to Favorites">
                        <span className="engagement-icon">
                          <svg className="engagement-icon">
                            <use xlinkHref="#icon-fave_hollow"></use>
                          </svg>
                        </span>
                      </span>
                      <span className="engagement-count">{photos[index].faves}</span>
                      <a className="engagement-item comment" arial-label="comments">
                        <span className="engagement-icon">
                          <svg className="engagement-icon">
                            <use xlinkHref="#icon-comment_hollow"></use>
                          </svg>
                        </span>
                        <span className="engagement-count">{photos[index].comments}</span>
                      </a>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (<h3>Loading...</h3>
            )}
        </div>
      </div>
    );
  }
}

export default App;
