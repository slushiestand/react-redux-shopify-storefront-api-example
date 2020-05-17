import React, { Component } from 'react';
import Product from './Product';

class Products extends Component {

  render() {
    const { stateTags = {} } = this.props
    let products;
    if (this.props.products) {
      products = this.props.products.map((product) => {
        const currentProductId = product.id
        const tagsForProduct = stateTags[currentProductId]
        const { tag = '' } = tagsForProduct
        if (tag.includes(this.props.tag)) {
          return (
            <Product
              addVariantToCart={this.props.addVariantToCart}
              client={this.props.client}
              key={product.id.toString()}
              product={product}
            />
          );
        }
      });
    } else {
      products = <p>Loading...</p>
    }
    products.reverse(); // CHFE 2018.10.15 - this makes it so the products are shown newest to oldest on first load
    return (
      <div className="Product-wrapper">
        {products}
      </div>
    );
  }
}

export default Products;
