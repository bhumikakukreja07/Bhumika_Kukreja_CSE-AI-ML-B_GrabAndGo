async function postData(endpoint_url, data) {
        const port = window.location.port;
        const base_url = `http://localhost:${port}${endpoint_url}`;
        var response = await fetch(base_url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
        });
        return await response.json();
}

/**
 * Fetch current quantity for an item in the cart (or 0 if not present)
 */
async function getQuantity(item_id) {
  const user_entered_email = localStorage.getItem('email');
  const user_entered_password = localStorage.getItem('password');

  if (!user_entered_email && user_entered_password) return 0;
  const result = await postData('/cart_quantity', { user_entered_email,user_entered_password, item_id });
  if (result.success) return result.quantity;
  console.error('Error fetching quantity:', result.error);
  return 0;
}


async function modifyAndUpdate(item_id, action) {
  const result = await postData('/modify_cart', { email_name: localStorage.getItem('email'), item_id, action });
  if (result.success) {
    const newQty = result.updated?.quantity || result.inserted?.quantity || 0;
    updateQuantityUI(item_id, newQty);
  } else {
    console.error('Cart action failed:', result.error || result.message);
  }
}

/**
 * Update the control UI for a given item based on its quantity
 */
function updateQuantityUI(item_id, quantity) {
  const container = document.getElementById(`cart-controls-${item_id}`);
  if (!container) return;

  const isAdminPage = window.location.pathname.startsWith('/seller_dashboard');
  if(!isAdminPage){
    if (quantity > 0) {
      container.innerHTML = `
        <div class="cart-quantity-wrapper">
          <button id="minus-btn-${item_id}" class="qty-btn qty-btn-minus">−</button>
          <span id="qty-display-${item_id}" class="qty-display">${quantity}</span>
          <button id="plus-btn-${item_id}" class="qty-btn qty-btn-plus">＋</button>
        </div>
      `;
      document.getElementById(`minus-btn-${item_id}`)
        .addEventListener('click', () => modifyAndUpdate(item_id, 'delete'));
      document.getElementById(`plus-btn-${item_id}`)
        .addEventListener('click', () => modifyAndUpdate(item_id, 'add'));
    } else {
      container.innerHTML = `
        <button id="add-btn-${item_id}" class="add-cart-btn">
          Add to Cart
        </button>
      `;
      document.getElementById(`add-btn-${item_id}`)
        .addEventListener('click', () => modifyAndUpdate(item_id, 'add'));
    }
  }
}

async function addHTMLToBody(
        parentId = null,
        buttonId,
        contentId,
        imageSrc,
        title,
        price,
        description,
        item_id,
        img_width = "19rem",
        img_height = "370px",
        image_type = "portrate"
      ) {

        const main_card = `
        <div class="main-card" style="text-align: center;">
          <button id="${buttonId}" style="background: none; border: none; padding: 0; cursor: pointer;">
            <img src="${imageSrc}" alt="${title}" height="${img_height}" style="width: clamp(10rem , 50vw , ${img_width});">
            <h2 style="padding: 0px; margin: 0px;">${title}</h2>
            </button>

            <p>₹${price}</p>
              <p>${description}</p>
              <div id="cart-controls-${item_id}" class="cart-controls"></div>
        </div>
  `;
        const popup = `
        <div id="${contentId}" style="display: none; padding: 0px; margin: 0px;">
          <div class="child_of_popup">
            <img src="${imageSrc}" alt="${title}"
              style="${
                image_type == "landscape"
                  ? 'width: clamp(20rem, 50vw, 70rem); height: clamp(20rem, 30vw, 70rem);'
                  : 'width: clamp(16rem, 35vw, 45rem);  height: clamp(28rem, 80vh, 100rem);'
              }">
          </div>
          <h2>${title}</h2>
          <p>${description}</p>
          <button class="add-to-cart" style="margin-top: 0.5rem; padding: 0.5rem 1rem; background-color: #007BFF; color: white; border: none; border-radius: 5px; cursor: pointer;">
            Add to Cart
          </button>
        </div>
        ${main_card}
  `;
let html = popup


      
        const parent = parentId ? document.getElementById(parentId) : document.body;
      
        if (parent) parent.insertAdjacentHTML('beforeend', html);
        else document.body.insertAdjacentHTML('beforeend', html);      

      // after insertion, render the control UI
      const qty = await getQuantity(item_id);
      updateQuantityUI(item_id, qty);
    }

    export { postData, getQuantity, addHTMLToBody, updateQuantityUI };
