import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import ShopifyBuy from 'shopify-buy/index.unoptimized.umd.min'
import { Provider } from 'react-redux';
import store from './store';
import './styles/shopify.css';

const storeName = 'XXXXXXXXXXX';
const storefrontAccessToken = 'XXXXXXXXXXXXX';

// https://shopify.dev/docs/storefront-api/getting-started
const client = ShopifyBuy.buildClient({
  domain: `${storeName}.myshopify.com`,
  storefrontAccessToken
});
store.dispatch({ type: 'CLIENT_CREATED', payload: client });

//docs -> https://shopify.dev/docs/storefront-api/reference/object/product#fields-2020-04
const productsQuery = client.graphQLClient.query((root) => {
  root.addConnection('products', { args: { first: 10 } }, (product) => {
    product.add('id');
    product.add('tags');
  });
});

const convertArrayToObject = (array, key) => {
  const initialValue = {};
  return array.reduce((obj, item) => {
    return {
      ...obj,
      [item[key]]: item,
    };
  }, initialValue);
};


client.graphQLClient.send(productsQuery).then(({ model, data }) => {
  console.warn({ model: model.products })
  const productTags = model.products.map(product => {
    const tags = {
      'id': product.attrs.id.value,
      'tag': product.attrs.tags.value.map(tag => tag.value)
    }
    return tags
  });
  const productTagsById = convertArrayToObject(productTags, 'id')
  store.dispatch({ type: 'PRODUCTS_TAGS', payload: productTagsById });
  console.warn({ productTags })
});

// buildClient() is synchronous, so we can call all these after!
client.product.fetchAll().then((res) => {
  console.warn({ res })
  store.dispatch({ type: 'PRODUCTS_FOUND', payload: res });
}).catch((e) => console.warn(e));
client.checkout.create().then((res) => {
  store.dispatch({ type: 'CHECKOUT_FOUND', payload: res });
});
client.shop.fetchInfo().then((res) => {
  store.dispatch({ type: 'SHOP_FOUND', payload: res });
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
