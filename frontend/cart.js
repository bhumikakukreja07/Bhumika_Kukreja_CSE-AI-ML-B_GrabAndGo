import { updateQuantityUI } from './components/create_html_elements.js';

    // POST helper
    async function postData(endpoint_url, data) {
      const hostname = window.location.hostname;
      const port = window.location.port;
      const base_url = `http://${hostname}:${port}${endpoint_url}`;
      const response = await fetch(base_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await response.json();
    }

    export async function loadCartItems() {

      let email_name = localStorage.getItem('email');
        let user_password = localStorage.getItem('password');
      if (!email_name || !user_password) {
        window.location.href = 'login.html';
        return;
      }

      // ask the server for this user’s cart rows
      const result = await postData('/get_cart_items', { email_name });
      if (!result.success) {
        console.error('Failed to load cart:', result.error || result.message);
        return;
      }

      const cartList = document.getElementById('cart-list');
      cartList.innerHTML = ''; // clear any old content

      let totalItems = 0;
      let totalPrice = 0;

      // loop through each row and append to the UL
      for (const row of result.items) {
        const li = document.createElement('li');
        const row_from__items_List = await postData('/get_row_from_table', { table_name:"items_list", item_id: row.item_id });
        const price = parseFloat(row_from__items_List.row.price);
        const qty = parseInt(row.quantity, 10);

        totalItems += qty;
        totalPrice += price * qty;
        // <h1 style="background-color: #0faed6;">
        //   ${JSON.stringify(row_from__items_List.row.title)}
        // </h1>`;

        li.innerHTML = `
        
          <div class="cart-item">
            <div class="item-header">
              <h2 class="item-title">${row_from__items_List.row.title}</h2>
              <span class="item-price">₹${row_from__items_List.row.price}</span>
            </div>
            <p class="item-qty">Quantity: ${row.quantity}</p>
            <div id="cart-controls-${row.item_id}" class="qty-control"></div>
          </div>
          `;
        cartList.appendChild(li);
        updateQuantityUI(row.item_id, qty);
      }

            // Subtotal summary
            const summaryLi = document.createElement('li');
            summaryLi.innerHTML = `<div class="cart-summary">Subtotal (${totalItems} items): ₹${totalPrice.toFixed(2)}</div>`;
            cartList.appendChild(summaryLi);

    }

    // run it as soon as the page is ready
    window.addEventListener('DOMContentLoaded', loadCartItems);
