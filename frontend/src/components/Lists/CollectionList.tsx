import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import CollectionThumbnail from "../Thumbnails/CollectionThumbnail";
import "./CollectionList.scss";

interface Props extends RouteComponentProps {
  collections: Collection[];
}

interface Collection {
  id: string;
  title: string;
  authorId: string;
  author: string;
}

class CollectionList extends React.Component<Props> {
  render() {
    return (
      <div className="collection-results">
        {this.props.collections.map((collection) => (
          <div
            onClick={(e) => {
              e.preventDefault();
              this.props.history.push(`/collection/${collection.id}`);
            }}
            key={collection.id}
            className="collection-result"
          >
            <CollectionThumbnail {...collection} />
          </div>
        ))}
      </div>
    );
  }
}

export default withRouter(CollectionList);
