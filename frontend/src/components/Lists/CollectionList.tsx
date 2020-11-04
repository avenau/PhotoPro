import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import CollectionThumbnail from '../Thumbnails/CollectionThumbnail'
interface Props extends RouteComponentProps {
  collections: Collection[];
}

interface Collection {
  title: string;
  price: number;
  discount: number;
  id: string;
  purchasable: boolean;
}

class CollectionList extends React.Component<Props> {
  render() {
    return (
      <>
        {this.props.collections.map((collection) => (
          <div
            onClick={(e) => {
              e.preventDefault();
              this.props.history.push(`/collection/${collection.id}`);
            }}
            className="collection-result"
            key={collection.id}
          >
            <CollectionThumbnail {...collection} />
          </div>
        ))}
      </>
    );
  }
}

export default withRouter(CollectionList);
