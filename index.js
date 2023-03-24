const acheterBtns = document.querySelectorAll('.col-4 button');
const cartIcon = document.querySelector('.cart-icon');
const cartContent = document.querySelector('.cart-content');
const cartTotal = document.querySelector('.cart-total');
const validateButton = document.querySelector('.cart-validate');
const orderForm = document.querySelector('.order-form');
const formulaire = document.getElementById('formulaire');
const invoice = document.querySelector('.invoice');

let totalPrice = 0;
let totalQty = 0;
let cartItems = [];

acheterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const product = btn.parentNode;
    const productImg = product.querySelector('img').getAttribute('src');
    const productName = product.querySelector('h3').textContent;
    const productPrice = parseFloat(product.querySelector('p').textContent);
    const cartItem = { img: productImg, name: productName, price: productPrice, qty: 1 };
    const existingItem = cartItems.find((item) => item.name === productName);
    if (existingItem) {
      existingItem.qty++;
    } else {
      cartItems.push(cartItem);
    }
    totalPrice += productPrice;
    totalQty++;
    updateCart();
  });
});

cartIcon.addEventListener('click', () => {
  if (cartItems.length === 0) {
    alert("Votre panier est vide. Ajoutez des produits pour continuer");
    return;
  }

  cartContent.innerHTML = '';
  cartItems.forEach((item) => {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div>
        <h4>${item.name}</h4>
        <h5>${item.price} fcfa x ${item.qty}</h5>
      </div>
    `;
    cartContent.appendChild(cartItem);
  });
  cartTotal.textContent = `Total : ${totalPrice} fcfa (${totalQty} article(s))`;
});

function updateCart() {
  const cartQty = document.querySelector('.cart-qty');
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  cartQty.textContent = cartCount;
  totalPrice = cartItems.reduce((acc, item) => acc + (item.qty * item.price), 0);
}


validateButton.addEventListener('click', () => {
  if (cartItems.length === 0) {
    alert("Votre panier est vide. Ajoutez des produits pour continuer");
    return;
  }

  // Vérifiez si le formulaire est déjà affiché avant de l'afficher
  if (!orderForm.classList.contains('hidden')) {
    return;
  }

  // Créer une superposition semi-transparente
  const overlay = document.createElement('div');
  overlay.classList.add('overlay');
  document.body.appendChild(overlay);

  // Afficher le formulaire uniquement si le panier contient des articles
  orderForm.classList.remove('hidden');

  // Appliquer le style CSS pour le positionner au milieu de la page
  orderForm.style.position = 'fixed';
  orderForm.style.top = '50%';
  orderForm.style.left = '50%';
  orderForm.style.transform = 'translate(-50%, -50%)';

  // Mettre la div « cart » en arrière-plan
  const cartDiv = document.querySelector('.cart');
  cartDiv.style.zIndex = '1';
  orderForm.style.zIndex = '2';
});

function validateForm() {
  const nom = document.getElementById('nom').value;
  const prenom = document.getElementById('prenom').value;
  const adresse = document.getElementById('adresse').value;
  const date = document.getElementById('date').value;

  if (cartItems.length === 0) {
    alert("Votre panier est vide. Ajoutez des produits pour continuer");
    return false;
  }

  if (nom === '' || prenom === '' || adresse === '' || date === '') {
    alert("Veuillez remplir tous les champs du formulaire");
    return false;
  }

  // Supprimer la superposition semi-transparente
  const overlay = document.querySelector('.overlay');
  if (overlay) {
    overlay.remove();
  }

  return true;
}


// Ajouter un écouteur d'événement pour le formulaire

formulaire.addEventListener('submit', (event) => {
  event.preventDefault(); // Empêcher le formulaire de soumettre les données

  // Valider le formulaire
  const isValid = validateForm();
  if (isValid) {
    // Cacher le formulaire
    const orderForm = document.querySelector('.order-form');
    orderForm.style.display = 'none';

    // Afficher la facture
    const invoice = document.querySelector('.invoice');
    invoice.style.display = 'block';
  }
});


  function showCart() {
    cartContent.innerHTML = '';
    let total = 0;
    cartItems.forEach(item => {
      const itemPrice = item.price * item.qty;
      cartContent.innerHTML += `
        <div class="cart-item">
          <span class="cart-item-name">${item.name}</span>
          <span class="cart-item-qty">${item.qty} x ${item.price} FCFA</span>
          <span class="cart-item-price">${itemPrice} FCFA</span>
          <button class="remove-item">X</button>
        </div>
      `;
      total += itemPrice;
    });
    cartTotal.textContent = `Total : ${total} FCFA`;
  }

  // Gestionnaire d'événement pour les boutons de suppression d'article dans le panier
  cartContent.addEventListener('click', event => {
    if (event.target.classList.contains('remove-item')) {
    const itemIndex = cartItems.findIndex(item => item.name === event.target.parentElement.querySelector('.cart-item-name').textContent);
    const removedItem = cartItems.splice(itemIndex, 1)[0];
    totalQty -= removedItem.qty;
    totalPrice -= removedItem.qty * removedItem.price;
    updateCart();
    showCart();
    }
    });
    
    // Add event listener to form submission
formulaire.addEventListener('submit', generateInvoice);

function generateInvoice(e) {
  e.preventDefault();

  // Get user input values
  const nom = document.getElementById('nom').value;
  const prenom = document.getElementById('prenom').value;
  const adresse = document.getElementById('adresse').value;
  const date = document.getElementById('date').value;


  const total = totalPrice;

  
  const invoiceHTML = `
    <div class="invoice-container">
      <h2>FACTURE</h2>
      <div class="info">
        <p><strong>Nom:</strong> ${nom}</p>
        <p><strong>Prénom:</strong> ${prenom}</p>
        <p><strong>Adresse:</strong> ${adresse}</p>
        <p><strong>Date:</strong> ${date}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Libellé</th>
            <th>Prix</th>
          </tr>
        </thead>
        <tbody>
          ${cartItems.map(item => `
            <tr>
              <td>${item.name} x ${item.qty}</td>
              <td>${item.price * item.qty} FCFA</td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot>
          <tr>
            <td>Total:</td>
            <td>${total} FCFA</td>
          </tr>
        </tfoot>
      </table>
    </div>
  `;

  
  invoice.innerHTML = invoiceHTML;
  invoice.classList.remove('hidden');


  formulaire.classList.add('hidden');
  document.querySelector('.order-form').classList.add('hidden');

  const printButton = document.createElement('button');
  printButton.innerText = 'Imprimer';
  printButton.addEventListener('click', () => {
    const invoiceWindow = window.open('', 'PRINT', 'height=600,width=800');
    invoiceWindow.document.write('<html><head><title>Facture</title>');
    invoiceWindow.document.write('</head><body>');
    invoiceWindow.document.write(invoiceHTML);
    invoiceWindow.document.write('</body></html>');
    invoiceWindow.document.close();
    invoiceWindow.focus();
    invoiceWindow.print();
    invoiceWindow.close();
  });
  invoice.appendChild(printButton);


  const downloadButton = document.createElement('a');
  downloadButton.innerText = 'Télécharger';
  downloadButton.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(invoiceHTML));
  downloadButton.setAttribute('download', 'facture.html');
  downloadButton.style.backgroundColor = '#4CAF50';
downloadButton.style.color = 'white';
downloadButton.style.padding = '10px 20px';
downloadButton.style.textAlign = 'center';
downloadButton.style.textDecoration = 'none';
downloadButton.style.display = 'inline-block';
downloadButton.style.fontSize = '16px';
downloadButton.style.margin = '4px 2px';
downloadButton.style.cursor = 'pointer';
downloadButton.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(invoiceHTML));
downloadButton.setAttribute('download', 'facture.html');
invoice.appendChild(downloadButton);
  invoice.appendChild(downloadButton);
}


    
    


    