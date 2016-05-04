import React from 'react';

export default class Footer extends React.Component {
  render(){
    return(
      <div className="footer">
        <p>Love from <img src="public/img/logo.png" className="logo"/>
            & <img src="public/img/soundcloud.png" className="soundcloud"/></p>
      </div>
    )
  }
}
