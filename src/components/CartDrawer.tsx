'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useI18n } from '@/lib/i18n';
import { getProduct } from '@/data/products';
import { formatDate, formatMXN } from '@/lib/format';

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotal } =
    useCart();
  const { t, locale } = useI18n();

  return (
    <>
      <div
        className={`cart-drawer-backdrop ${isOpen ? 'is-open' : ''}`}
        onClick={closeCart}
        aria-hidden="true"
      />
      <aside
        className={`cart-drawer ${isOpen ? 'is-open' : ''}`}
        aria-hidden={!isOpen}
        aria-label={t('common.cart.title')}
      >
        <div className="cart-drawer-head">
          <div>
            <span className="eyebrow eyebrow--bare">
              {t('common.nav.reserve')}
            </span>
            <h2>{t('common.cart.title')}</h2>
          </div>
          <button
            type="button"
            className="cart-drawer-close"
            onClick={closeCart}
            aria-label={t('common.actions.close')}
          >
            <X size={18} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-drawer-empty">
            <span className="cart-empty-icon">
              <ShoppingBag size={28} strokeWidth={1.2} />
            </span>
            <h3>{t('common.cart.emptyTitle')}</h3>
            <p>{t('common.cart.emptyHint')}</p>
            <Link href="/rutas" className="btn btn-primary" onClick={closeCart}>
              {t('common.actions.explore')}
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-drawer-items">
              {items.map((item) => {
                const product = getProduct(item.slug);
                if (!product) return null;
                return (
                  <article
                    className="cart-drawer-item"
                    key={`${item.slug}-${item.date}`}
                  >
                    <div className="cart-drawer-thumb">
                      <Image
                        src={product.image}
                        alt={product.title[locale]}
                        fill
                        sizes="90px"
                      />
                    </div>
                    <div className="cart-drawer-info">
                      <Link
                        href={`/product/${product.slug}`}
                        onClick={closeCart}
                      >
                        {product.title[locale]}
                      </Link>
                      <span className="cart-item-meta">
                        {product.state[locale]} · {formatDate(item.date, locale)}
                      </span>
                      <div className="cart-qty">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.slug,
                              item.date,
                              item.quantity - 1
                            )
                          }
                          aria-label="−"
                        >
                          <Minus size={12} />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.slug,
                              item.date,
                              item.quantity + 1
                            )
                          }
                          aria-label="+"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                    <div className="cart-drawer-price">
                      <strong>
                        {formatMXN(product.price * item.quantity, locale)}
                      </strong>
                      <button
                        type="button"
                        onClick={() => removeItem(item.slug, item.date)}
                        aria-label={t('common.cart.remove')}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="cart-drawer-foot">
              <div className="cart-drawer-total">
                <span>{t('common.cart.total')}</span>
                <strong>{formatMXN(subtotal, locale)}</strong>
              </div>
              <p className="cart-drawer-note">{t('common.cart.note')}</p>
              <Link
                href="/checkout"
                className="btn btn-primary btn-block"
                onClick={closeCart}
              >
                {t('common.cart.checkout')}
              </Link>
              <Link
                href="/carrito"
                className="cart-drawer-link"
                onClick={closeCart}
              >
                {t('common.actions.viewCart')}
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
