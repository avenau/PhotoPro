import React, { Component } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";

import ContentLoader from '../ContentLoader/ContentLoader';

interface Props extends RouteComponentProps {
  albumTitle?: string;
  discount?: number;
  tags?: string[];
  photos?: string[];
  albumId: string;
}

interface State {
  albumTitle?: string;
  discount?: number;
  tags?: string[];
  photos?: string[];
  albumId: string;
}

class AlbumDisplay extends Component<Props, State> {
  constructor(props: Props){
    super(props);
    this.state = {
      albumTitle: props.albumTitle,
      discount: props.discount,
      tags: props.tags,
      photos: props.photos,
      albumId: props.albumId
    }
  }

  render(){
    return(
      <ContentLoader
        query={this.state.albumId}
        route="/album/photos"
        type="albumPhotos"
      />
  );}
}

export default withRouter(AlbumDisplay);
