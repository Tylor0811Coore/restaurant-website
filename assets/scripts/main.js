/**
 * This is used to style the navigation when
 * the user scrolls on the webpage
 */
window.addEventListener('scroll', () => {
   const headerElement = document.querySelector('.header');
   if (window.scrollY >= 70) {
      headerElement.classList.add('scrolled');
   }
   else {
      headerElement.classList.remove('scrolled');
   }
});

/**
**********************************
   Theme toggle and local storage
**********************************
 */
const themeToggleBtn = document.querySelector('.nav__theme-toggle-btn'),
      iconElement = document.querySelector('.nav__theme-toggle-btn i');

themeToggleBtn.addEventListener('click', () => {
   document.documentElement.classList.toggle('dark');
   if (document.documentElement.classList.contains('dark')) {
      iconElement.classList.replace('ri-moon-line', 'ri-sun-line');//change theme toggle btn icon
      localStorage.setItem('current-theme', 'dark');//save changes to local storage
   }
   else {
      iconElement.classList.replace('ri-sun-line', 'ri-moon-line');
      localStorage.removeItem('current-theme');
   }
});

function getCurrentThemeFromStorage() {
   if (localStorage.getItem('current-theme') !== null) {
      document.documentElement.classList.add('dark');
      iconElement.classList.replace('ri-moon-line', 'ri-sun-line');
   }
}
getCurrentThemeFromStorage();

/**
***************************************
   Nav menu toggle and functionalities
***************************************
 */
const navMenu = document.querySelector('.nav__menu'),
      navMenuOpenBtn = document.querySelector('.nav__menu-open-btn'),
      navMenuCloseBtn = document.querySelector('.nav__menu-close-btn'),
      navMenuLinks = document.querySelectorAll('.nav__menu-link');

navMenuOpenBtn.addEventListener('click', () => {
   navMenu.classList.add('active');
});

navMenuCloseBtn.addEventListener('click', () => {
   navMenu.classList.remove('active');
});

navMenuLinks.forEach((navMenuLink) => {
   navMenuLink.addEventListener('click', () => {
      navMenu.classList.remove('active');
   });
});

/**
**********************************
   Hero Slider
**********************************
 */
const sliderImages = document.querySelectorAll('.hero__slider-img'),
      sliderDots = document.querySelectorAll('.hero__slider-dot');

function removeCurrentSlide(currentIndex) {
   sliderImages[currentIndex].style.display = 'none';
   sliderDots[currentIndex].classList.remove('active');
}

function showCurrentSlide(currentIndex) {
   sliderImages[currentIndex].style.display = 'block';
   sliderDots[currentIndex].classList.add('active');
}

function runSlider() {
   let currentIndex = 0;
   const sliderInterval = 10000;
   setInterval(() => {
      removeCurrentSlide(currentIndex);
      ++currentIndex;//go to next image in slider
      if (currentIndex > (sliderImages.length - 1)) {
         currentIndex = 0;//restart the slider
      }
      showCurrentSlide(currentIndex);
   }, sliderInterval);
}
runSlider();

/**
**********************************
   Render services on page
**********************************
 */
function renderServicesOnPage() {
   let servicesHtml = ``;

   servicesData.forEach((serviceData) => {
      servicesHtml += `
         <div class="service">
            <i class="${serviceData.icon} btn-icon service__icon"></i>
            <h2 class="service__title">${serviceData.title}</h2>
            <p class="service__text">${serviceData.text}</p>
         </div>
      `;
   });

   // display services html on page
   document.querySelector('.services__container').innerHTML = servicesHtml;
}
renderServicesOnPage();

/**
************************************
   Menu buttons and functionalities
************************************
 */
function getFormattedPrice(priceInCents) {
   return (priceInCents / 100).toFixed(2);
}

function renderMenuItemsOnPage(filterName) {
   let menuItemsHtml = ``;

   //generate html for each food item
   foodItemsData.forEach((foodItemData) => {
      const id = foodItemData.id;
      if (foodItemData.foodType === filterName) {
         menuItemsHtml += `
            <div class="menu__item">
               <div class="menu__img-container">
                  <img src="${foodItemData.image}" class="menu__img">
               </div>
               <p class="menu__item-name">${foodItemData.name}</p>
               <p class="menu__item-price">$${getFormattedPrice(foodItemData.priceInCents)}</p>
               <button type="button" class="btn menu__item-cart-btn" onclick="Cart.addItemToCart('${id}')">
                  Add to Cart
               </button>
            </div>
         `;
      }
   });

   // display menu items html on page
   document.querySelector('.menu__items-container').innerHTML = menuItemsHtml;
}
renderMenuItemsOnPage('beverage');//display the beverage menu on page by default

function removeCurrentActiveButton() {
   document.querySelector('.menu__btn.active').classList.remove('active');
}

const menuBtns = document.querySelectorAll('.menu__btn');
menuBtns.forEach((menuBtn) => {
   menuBtn.addEventListener('click', (event) => {
      removeCurrentActiveButton();
      event.currentTarget.classList.add('active');//add active styles to the clicked button

      //get filter name from the menu btn clicked
      const filterName = event.currentTarget.dataset.filterName;
      renderMenuItemsOnPage(filterName);
   });
});

/**
************************************************************
   Cart class and functions
************************************************************
 */
class Cart {
   static getCartFromLocalStorage() {
      const cart = localStorage.getItem('cart');
      return (cart === null) ? [] : JSON.parse(cart);
   }
   // ==================================================

   static updateCartInLocalStorage(updatedCart) {
      localStorage.setItem('cart', JSON.stringify(updatedCart));
   }
   // ==================================================

   static renderCartTotalQuantityOnPage() {
      const cart = this.getCartFromLocalStorage();
      let totalCartQuantity = 0;

      cart.forEach(cartItem => totalCartQuantity += cartItem.quantity);
      if (totalCartQuantity > 0) {
         document.querySelector('.nav__cart-total-quantity').innerText = totalCartQuantity;
         document.querySelector('.cart__empty-text').style.display = 'none';//hide text from cart
      }
      else {
         document.querySelector('.nav__cart-total-quantity').innerText = 0;
         document.querySelector('.cart__empty-text').style.display = 'inline';//display text in cart
      }
   }
   // ==================================================

   static isItemInCart(itemId) {
      const cart = this.getCartFromLocalStorage();
      let found = false;

      cart.forEach(cartItem => {
         if (cartItem.id === itemId) {
            found = true;
            return;
         }
      });

      return found;
   }
   // ==================================================

   static addItemToCart(itemId) {
      const cart = this.getCartFromLocalStorage();
      const foodItemData = foodItemsData.find(foodItemData => foodItemData.id === itemId);

      if (cart.length === 0 || !this.isItemInCart(itemId)) {
         //add new item at the start of the cart
         cart.unshift({
            id: foodItemData.id,
            name: foodItemData.name,
            image: foodItemData.image,
            priceInCents: foodItemData.priceInCents,
            quantity: 1
         });
      }
      else {
         //add 1 to the existing cart item quantity
         cart.forEach(cartItem => {
            if (cartItem.id === itemId) {
               ++cartItem.quantity;
               return;
            }
         });
      }

      this.updateCartInLocalStorage(cart);
      renderCartItemsHtml();
      this.renderOverallTotalOnPage();
      this.renderCartTotalQuantityOnPage();
   }
   // ==================================================

   static getCartItemTotalPrice(itemId) {
      const cart = this.getCartFromLocalStorage();
      let cartItemTotal = undefined;

      cart.forEach(cartItem => {
         if (cartItem.id === itemId) {
            cartItemTotal = cartItem.priceInCents * cartItem.quantity;
         }
      });

      return (cartItemTotal / 100).toFixed(2);
   }
   // ==================================================

   static incrementItemQuantity(itemId) {
      const cart = this.getCartFromLocalStorage();

      //add 1 to the existing cart item quantity
      cart.forEach(cartItem => {
         if (cartItem.id === itemId) {
            ++cartItem.quantity;
            return;
         }
      });

      this.updateCartInLocalStorage(cart);
      renderCartItemsHtml();
      this.renderOverallTotalOnPage();
      this.renderCartTotalQuantityOnPage();
   }
   // ==================================================

   static decrementItemQuantity(itemId) {
      const cart = this.getCartFromLocalStorage();

      //add 1 to the existing cart item quantity
      cart.forEach((cartItem, cartItemIndex) => {
         if (cartItem.id === itemId) {
            if (cartItem.quantity > 1) {
               --cartItem.quantity;
            }
            else {
               //remove item from cart
               cart.splice(cartItemIndex, 1);//remove from cart
            }
         }
      });

      this.updateCartInLocalStorage(cart);
      renderCartItemsHtml();
      this.renderOverallTotalOnPage();
      this.renderCartTotalQuantityOnPage();
   }
   // ==================================================

   static renderOverallTotalOnPage() {
      const cart = this.getCartFromLocalStorage();
      let overallTotal = 0;

      cart.forEach(cartItem => {
         const cartItemTotal = cartItem.priceInCents * cartItem.quantity;
         overallTotal += cartItemTotal;
      })

      if (overallTotal === 0) {
         document.querySelector('.cart__footer-total-price').innerText = '$0.00';
      }
      else {
         document.querySelector('.cart__footer-total-price').innerText =
            '$' + getFormattedPrice(overallTotal);
      }
   }
   // ==================================================

   static removeCartItem(id) {
      const cart = this.getCartFromLocalStorage();
      cart.forEach((cartItem, cartItemIndex) => {
         if (cartItem.id === id) {
            //remove item from cart
            cart.splice(cartItemIndex, 1);//remove from cart
            return;
         }
      });

      this.updateCartInLocalStorage(cart);
      renderCartItemsHtml();
      this.renderOverallTotalOnPage();
      this.renderCartTotalQuantityOnPage();
   }
}
Cart.renderCartTotalQuantityOnPage();
Cart.renderOverallTotalOnPage();

/**
************************************************************
   Cart buttons and functionalities
************************************************************
 */
const cartOpenBtn = document.querySelector('.nav__cart-open-btn'),
      cartCloseBtn = document.querySelector('.cart__close-btn'),
      cart = document.querySelector('.cart');

cartOpenBtn.addEventListener('click', () => {
   cart.classList.add('active');
});

cartCloseBtn.addEventListener('click', () => {
   cart.classList.remove('active');
});

function renderCartItemsHtml() {
   const cart = Cart.getCartFromLocalStorage();
   let cartItemsHtml = ``;
   let overallTotal = 0;

   cart.forEach(cartItem => {
      const id = cartItem.id;
      overallTotal += cartItem.priceInCents;
      cartItemsHtml += `
         <div class="cart__item d-grid">
            <div class="cart__item-img-container">
               <img src="${cartItem.image}" class="cart__item-img">
            </div>
            <div class="cart__item-content d-flex">
               <div class="cart__item-content-header d-flex">
                  <p class="cart__item-name">${cartItem.name}</p>
                  <p class="cart__item-price">$${getFormattedPrice(cartItem.priceInCents)}</p>
               </div>
               <div class="cart__item-btns d-flex">
                  <button type="button" class="cart__item-decrement-btn" onclick="Cart.decrementItemQuantity('${id}')">
                     <i class="ri-subtract-line btn-icon cart__item-btn-icon"></i>
                  </button>
                  <p class="cart__item-quantity">${cartItem.quantity}</p>
                  <button type="button" class="cart__item-increment-btn" onclick="Cart.incrementItemQuantity('${id}')">
                     <i class="ri-add-line btn-icon cart__item-btn-icon"></i>
                  </button>
               </div>
            </div>
            <div class="cart-right-section d-flex">
               <p class="cart__item-total-price">$${Cart.getCartItemTotalPrice(id)}</p>
               <button class="cart__item-remove-button" onclick="Cart.removeCartItem('${id}')">Remove</button>
            </div>
         </div>
      `;
   });
   
   document.querySelector('.cart__items-container').innerHTML = cartItemsHtml;
}
renderCartItemsHtml();

//set the footer year text to the current year
document.querySelector('.current-year').innerText = new Date().getFullYear();