import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { HeroLetterLine } from "../components/TextReveal";

const products = [
  {
    name: "Nocturne Ring",
    price: 42,
    image: "/images/generated/piercing-nocturne-ring.webp",
    tag: "Čierny titán",
  },
  {
    name: "Blood Moon",
    price: 58,
    image: "/images/generated/piercing-blood-moon.webp",
    tag: "Červený zirkón / oceľ",
  },
  {
    name: "Twin Thorn",
    price: 36,
    image: "/images/generated/piercing-twin-thorn.webp",
    tag: "Chirurgická oceľ",
  },
  {
    name: "Orbit Chain",
    price: 64,
    image: "/images/generated/piercing-orbit-chain.webp",
    tag: "Čierny titán",
  },
  {
    name: "Ritual Bar",
    price: 49,
    image: "/images/generated/piercing-ritual-bar.webp",
    tag: "Červený zirkón / oceľ",
  },
  {
    name: "Void Spike",
    price: 31,
    image: "/images/generated/piercing-void-spike.webp",
    tag: "Chirurgická oceľ",
  },
];

export default function Eshop() {
  const [cart, setCart] = useState<number[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const total = useMemo(
    () => cart.reduce((sum, productIndex) => sum + products[productIndex].price, 0),
    [cart],
  );

  return (
    <main className="shop-page inner-page">
      <section className="shop-hero">
        <div
          className="page-gothic-wordmark page-gothic-wordmark--store"
          aria-hidden="true"
        >
          Piercing
        </div>
        <div className="shop-hero-image">
          <img src="/images/generated/piercing-collection.jpg" alt="Piercingy v štúdiu .INKSOUL." />
        </div>
        <div className="shop-hero-copy">
          <div className="inner-hero-meta">
            <span>.INKSOUL. / PIERCING SHOP</span>
            <span>TITÁN / CHIRURGICKÁ OCEĽ</span>
          </div>
          <h1>
            <HeroLetterLine text="DETAIL" />
            <HeroLetterLine text="PRE TELO." delay={0.1} />
          </h1>
          <p>
            Vybrané piercingy z bezpečných materiálov. Veľkosť a vhodné umiestnenie
            spolu doladíme v štúdiu.
          </p>
        </div>
      </section>

      <section className="product-section">
        <div className="product-toolbar">
          <span>6 piercingov</span>
          <button type="button" onClick={() => setCheckoutOpen(true)}>
            Taška [{String(cart.length).padStart(2, "0")}] · {total} €
          </button>
        </div>

        <div className="product-grid">
          {products.map((product, index) => (
            <motion.article
              className="product-card"
              key={product.name}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 0.6, delay: (index % 3) * 0.08 }}
            >
              <div className="product-image">
                <img src={product.image} alt={product.name} />
                <span>0{index + 1}</span>
                <button
                  type="button"
                  onClick={() => setCart((items) => [...items, index])}
                  aria-label={`Pridať ${product.name} do tašky`}
                >
                  + Pridať
                </button>
              </div>
              <div className="product-info">
                <div>
                  <h2>{product.name}</h2>
                  <span>{product.tag}</span>
                </div>
                <strong>{product.price} €</strong>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="shop-note">
        <span>Materiál / veľkosť / starostlivosť</span>
        <h2>VYBERIEME<br />SPRÁVNU VEĽKOSŤ.</h2>
        <p>
          Pri každom piercingu ti odporučíme vhodný rozmer, materiál aj následnú
          starostlivosť.
        </p>
        <Link to="/booking">
          Rezervovať piercing konzultáciu
          <i className="thorn-arrow thorn-arrow--inline" aria-hidden="true" />
        </Link>
      </section>

      <AnimatePresence>
        {checkoutOpen && (
          <motion.div
            className="checkout-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-title"
          >
            <motion.div
              className="checkout-panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
            >
              <button type="button" className="checkout-close" onClick={() => setCheckoutOpen(false)}>
                Zavrieť ×
              </button>
              <span>.INKSOUL. / TAŠKA</span>
              <h2 id="checkout-title">TVOJ VÝBER</h2>
              {cart.length === 0 ? (
                <p className="empty-cart">Zatiaľ je tu ticho.</p>
              ) : (
                <div className="cart-lines">
                  {cart.map((productIndex, cartIndex) => (
                    <div key={`${productIndex}-${cartIndex}`}>
                      <span>{products[productIndex].name}</span>
                      <b>{products[productIndex].price} €</b>
                    </div>
                  ))}
                </div>
              )}
              <div className="cart-total">
                <span>Spolu</span>
                <strong>{total} €</strong>
              </div>
              <button
                type="button"
                className="checkout-button"
                onClick={() => setCheckoutOpen(false)}
              >
                Objednávky spustíme čoskoro
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
