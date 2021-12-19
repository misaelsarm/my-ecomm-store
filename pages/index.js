import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import products from '../products.json'
import { initiateCheckout } from '../lib/payments';
import { useState } from 'react';

const defaultCart = {
  products: {}
}

export default function Home() {
  const [cart, setCart] = useState(defaultCart)

  const cartItems = Object.keys(cart.products).map(key => {
    const product = products.find(({ id }) => `${id}` === `${key}`)
    return {
      ...cart.products[key],
      pricePerItem: product.price
    }
  })

  console.log(cartItems);

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

  return (
    <div className={styles.container}>
      <Head>
        <title>Space Jelly Shop</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Space Jelly Shop
        </h1>

        <p className={styles.description}>
          The best space jellyfish swag in the Universe
        </p>
        <p className={styles.description}>
          <strong>Items:</strong> {quantity}
          <br /><strong>Total Cost:</strong> ${subtotal}
          <br />
          <button
            onClick={checkout}
            className={styles.button}>Checkout</button>
        </p>

        <ul className={styles.grid}>
          {
            products.map(({ id, title, image, description, price }) => {
              return (
                <li key={id} className={styles.card}>
                  <a href="#" >
                    <img src={image} alt="" />
                    <h2>{title}</h2>
                    <p>${price}</p>
                    <p>{description}</p>
                  </a>
                  <button className={styles.button} onClick={() => {
                    addToCart({
                      id
                    })
                  }}>Add to cart</button>
                </li>
              )
            }

            )
          }

        </ul>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
