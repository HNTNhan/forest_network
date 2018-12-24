import React, { Component } from 'react';
class NewFeed extends Component {
    state = {  }
    render() { 
        return ( 
            <div className="row bg-newfeed">
            <div className="col-1 icon-newfeed rounded-circle" style={{"backgroundImage": "url(images/chalee.jpg)"}}></div>
            <div className="col-11">
              <div className="row">
                Ngoc Bui - November 30
              </div>
              <div className="row">
                  Thread! There's still time to support our 5 featured #YouTubeGiving charities—click the "donate" button to the right of each video to make a difference in someone's life.
                  Imagine if you couldn’t watch the videos you love. We support copyright reform with an Article 13 that works for everyone. 
              </div>
              <div className="row">
                <div className="col-2 ">
                    <span className="glyphicon glyphicon-heart"></span>
                  69 </div>
                <div className="col-2">
                    <span className="glyphicon glyphicon-refresh"></span>
                  32</div>
                  <div className="col-2">
                      <span className="glyphicon glyphicon-thumbs-down"></span>
                    32</div>
                    <div className="col-2">
                        <span className="glyphicon glyphicon-hand-right"></span>
                      32</div>
              </div>
            </div>
          </div>


         );
    }
}
 
export default NewFeed;