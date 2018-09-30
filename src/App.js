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
    geometry: 0,
    error: null
  }

  getJustifiedLayout(tempphoto, tempratio) {
    var config = {
      containerWidth: 1060,
      containerPadding: {
        top: 50,
        right: 0,
        left: 100,
        bottom: 50
      },
      boxSpacing: 5,
      targetRowHeight: 220,
      targetRowHeightTolerance: 0.25,
      maxNumRows: Number.POSITIVE_INFINITY,
      forceAspectRatio: false,
      showWidows: true,
      fullWidthBreakoutRowCadence: false
    }
    var geometry = justifiedLayout(tempratio.slice(0, 50), config)
    this.setState({
      photos: tempphoto,
      height: geometry.containerHeight,
      geometry: geometry,
      isLoading: false
    });
  }

  getPhotos() {
    var jsondata
    var context = this
    axios
      .get("https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=2967edc0cbc11415bdd32aa62f19f688&format=rest")
      .then(response => {
        xml2js.parseString(response.data, { mergeAttrs: true, explicitArray: false }, (err, result) => {
          jsondata = result.rsp.photos.photo
        });
        var tempratio = [];
        var tempphoto = []
        var count = 0;
        jsondata.map(photo => {
          const { farm, server, secret, id } = photo;
          var imgsrc = `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}.jpg`;
          tempphoto.push(imgsrc);
          var img = new Image();
          img.onload = function () {
            tempratio.push(Number((this.width / this.height).toFixed(1)));
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
      <div className="fluid-centered" >
        <div className="photo-list-view" style={photoliststyle}>
          {!isLoading ? (
            geometry.boxes.map((box, index) => {
              var style = { width: box.width, height: box.height, top: box.top, left: box.left, backgroundImage: 'url(' + photos[index] + ')', }
              return (
                <div key={index} className="box" style={style}>
                </div>)
            })
          ) : (<h3>Loading...</h3>
            )}
        </div>
      </div>
    );

    {/* <div role="main" class="main fluid-centered">
          <div className="tittle-row"></div>
          <div className="view photo-list-view">
            <div className="view photo-list-photo-view awake">
              <div className="interaction-view">
                <div className="photo-list-photo-interacion">
                  <a className="overlay" role="heading" arial-level="3" aria-label="Blah blah blah" data-rapid_p="443"></a>
                  <div className="extra-tool"></div>
                  <div className="interaction-bar" title="Blah blah blah">
                    <div className="text">
                      <a className="tittle">Blah blah blah</a>
                      <a className="attribution">by blah</a>
                    </div>
                    <div className="engagement">
                      <span className="engagement-item fave" role="button" aria-label="Add to Favorites">
                        <span className="engagement-icon">
                          <svg className="icon icon-fave_hollow">
                            <use xlinkHref="#icon-fave_hollow"></use>
                          </svg>
                        </span>
                      </span>
                      <span className="engagement-count">999</span>
                      <a className="engagement-item comment" arial-label="comments">
                        <span className="engagement-icon">
                          <svg className="icon icon-comment_hollow">
                            <use xlinkHref="#icon-comment_hollow"></use>
                          </svg>
                        </span>
                        <span className="engagement-count">40</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
  }
}

export default App;
