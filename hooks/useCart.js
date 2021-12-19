import React, { useState } from 'react'
import { initiateCheckout } from '../lib/payments'
import products from '../products.json'

const defaultCart = {
  products: {}
}

const useCart = () => {
  const [cart, setCart] = useState(defaultCart)

  const cartItems = Object.keys(cart.products).map(key => {
    const product = products.find(({ id }) => `${id}` === `${key}`)
    return {
      ...cart.products[key],
      pricePerItem: product.price
    }
  })

  const subtotal = cartItems.reduce((accumulator, { pricePerItem, quantity }) => {
    return accumulator + (pricePerItem * quantity)
  }, 0)

  const quantity = cartItems.reduce((accumulator, { pricePerItem, quantity }) => {
    return accumulator + quantity
  }, 0)


  function addToCart({ id } = {}) {
    let cartState = { ...cart };
    if (cartState.products[id]) {
      cartState.products[id].quantity = cartState.products[id].quantity + 1;
    } else {
      cartState.products[id] = {
        id,
        quantity: 1
      }
    }
    setCart(cartState)
  }

  const checkout = () => {
    initiateCheckout({
      lineItems: cartItems.map(item => ({
        price: item.id,
        quantity: item.quantity
      }))
    })
  }

  return {
    cart,
    setCart,
    subtotal,
    cartItems,
    addToCart,
    checkout,
    quantity
  }
}

export default useCart
