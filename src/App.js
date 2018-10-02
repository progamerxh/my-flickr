import React, { Component } from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import justifiedLayout from 'justified-layout';
import logo from './logo.svg';
import InfiniteScroll from 'react-infinite-scroller';
import InfiniteScrollComponent from 'react-infinite-scroll-component'
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      photos: [],
      nextPage: 1,
      containerHeight: 0,
      geometry: null,
      hasMore: true,
    };
  }

  getJustifiedLayout(tempphoto, tempratio, context) {
    var config = {
      containerWidth: 1002,
      containerPadding: 0,
      boxSpacing: 5,
      targetRowHeightTolerance: 0.25,
      maxNumRows: Number.POSITIVE_INFINITY,
      forceAspectRatio: false,
      showWidows: false,
      fullWidthBreakoutRowCadence: false
    }
    var nextpage = context.state.nextPage;
    var containerHeight = context.state.containerHeight;
    var geometry = context.state.geometry;
    if (geometry) {
      containerHeight = config.boxSpacing + Number(geometry.containerHeight);
    }
    config.containerPadding = {
      top: containerHeight,
      right: 0,
      bottom: 0,
      left: 0
    }
    geometry = justifiedLayout(tempratio, config)
    var hasMore;
    nextpage++;
    nextpage > 10 ? (hasMore = false) : (hasMore = true);
    if (!hasMore) {
      return;
    }
    context.setState({
      photos: tempphoto,
      geometry: geometry,
      nextPage: nextpage++,
      hasMore,
      containerHeight,
    });
  }



  loadItems() {
    var context = this;
    var photosperload = 20;
    var url = `https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=2967edc0cbc11415bdd32aa62f19f688&extras=owner_name,count_faves,count_comments&format=json&nojsoncallback=1&per_page=${photosperload}&page=${context.state.nextPage}`;
    axios
      .get(url)
      .then(response => {
        var jsondata = response.data.photos.photo;
        if (context.state.nextpage > jsondata.pages)
          return;
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
              context.getJustifiedLayout(tempphoto, tempratio, context);
            }
          }
          img.src = imgsrc
        })
      })
      .catch(error => this.setState({ error, hasMore: false, isLoading: false }));
  }

  render() {
    const { geometry, photos, hasMore, items, containerHeight } = this.state;
    const loader = <div className="fluid-centered" key={0}><h3>Loading...</h3></div>;
    var styleheight = { height: containerHeight };
    var lastindex
    var key
    if (geometry) {
      console.log("Rerender")
      styleheight = { height: containerHeight };
      lastindex = items.length + 1;
      geometry.boxes.map((box, index) => {
        key = Number(index) + lastindex;
        let keystring = key.toString();
        var style = {
          width: box.width,
          height: box.height,
          backgroundImage: 'url(' + photos[index].src + ')',
          transform: 'translate(' + box.left + 'px' + ',' + box.top + 'px' + ')',
          WebkitTransform: 'translate(' + box.left + 'px' + ',' + box.top + 'px' + ')',
          MsTransform: 'translate(' + box.left + 'px' + ',' + box.top + 'px' + ')',
        }
        items.push(
          <div key={keystring} className="hvrbox hvrbox_background box" style={style}>
            <div className="hvrbox-layer_top">
              <div className="hvrbox-text">
                <div className="title">{photos[index].title}</div>
                <a className="attr">by {photos[index].owner}</a>
              </div>
              <div className="engagement">
                <svg className="icon" viewBox="0 0 24 24">
                  <path fill="#fff" d="M12.1,18.55L12,18.65L11.89,18.55C7.14,14.24 4,11.39 4,8.5C4,6.5 5.5,5 7.5,5C9.04,5 10.54,6 11.07,7.36H12.93C13.46,6 14.96,5 16.5,5C18.5,5 20,6.5 20,8.5C20,11.39 16.86,14.24 12.1,18.55M16.5,3C14.76,3 13.09,3.81 12,5.08C10.91,3.81 9.24,3 7.5,3C4.42,3 2,5.41 2,8.5C2,12.27 5.4,15.36 10.55,20.03L12,21.35L13.45,20.03C18.6,15.36 22,12.27 22,8.5C22,5.41 19.58,3 16.5,3Z" />
                </svg>
                <span className="engagement-count">{photos[index].faves}</span>
                <svg className="icon" viewBox="0 0 24  24">
                  <path fill="#fff" d="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10Z" />
                </svg>
                <span className="engagement-count">{photos[index].comments}</span>
              </div>
            </div>
          </div>
        );
      });
    }
    return (
      <InfiniteScroll
        pageStart={0}
        loadMore={this.loadItems.bind(this)}
        hasMore={hasMore}
        threshold={50}
        loader={loader}
        >
        <div className="fluid-centered" id="maincontent" >
          <div className="tittle-row">
            <h3>Explore</h3>
            <div className="tools">
              <button className="justified"></button>
              <button className="story"></button>
            </div>
          </div>
          <div className="photo-list-view" style={styleheight}>
            {items}
          </div>
        </div>
      </InfiniteScroll>
      
    );
  }
}

ReactDOM.render(
  <App />
  , document.getElementById('root'));