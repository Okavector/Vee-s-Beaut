(function ($) {
    "use strict";
    
    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Vendor carousel
    $('.vendor-carousel').owlCarousel({
        loop: true,
        margin: 29,
        nav: false,
        autoplay: true,
        smartSpeed: 1000,
        responsive: {
            0:{
                items:2
            },
            576:{
                items:3
            },
            768:{
                items:4
            },
            992:{
                items:5
            },
            1200:{
                items:6
            }
        }
    });


    // Related carousel
    $('.related-carousel').owlCarousel({
        loop: true,
        margin: 29,
        nav: false,
        autoplay: true,
        smartSpeed: 1000,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:2
            },
            768:{
                items:3
            },
            992:{
                items:4
            }
        }
    });


    // Product Quantity
    $('.quantity button').on('click', function () {
        var button = $(this);
        var oldValue = button.parent().parent().find('input').val();
        if (button.hasClass('btn-plus')) {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }
        button.parent().parent().find('input').val(newVal);
    });
    
})(jQuery);

// Cart Counter
$(document).ready(function() {
    let cartCount = 0;
    const $cartBadge = $('#cart-count'); // make sure your badge has id="cart-count"

    // Cart count will be handled by the new cart system
});


document.addEventListener("DOMContentLoaded", function () {
  // Update cart count on page load
  updateCartCount();

  // Add modern loading states
  function showLoading(element) {
    element.classList.add('loading');
  }
  
  function hideLoading(element) {
    element.classList.remove('loading');
  }

  // Attach click events to all Add to Cart buttons
  document.addEventListener("click", function (e) {
    if (e.target.closest(".add-to-cart")) {
      e.preventDefault();

      // Check authentication first
      if (window.authManager && !window.authManager.requireAuth('add items to cart')) {
        return;
      }

      const button = e.target.closest(".add-to-cart");
      
      // Show loading state
      showLoading(button);

      let productData;
      
      // Try to get product data from data attribute first
      if (button.dataset.product) {
        try {
          productData = JSON.parse(button.dataset.product);
        } catch (e) {
          console.error("Error parsing product data:", e);
        }
      }

      // Fallback to extracting from DOM
      if (!productData) {
        const productCard = button.closest(".product-item");
        const name = productCard.querySelector(".product-name")?.textContent.trim();
        const priceText = productCard.querySelector(".product-price")?.textContent.trim();
        const img = productCard.querySelector("img")?.getAttribute("src");

        if (!name || !priceText) {
          hideLoading(button);
          showNotification('Error: Product information not found', 'error');
          return;
        }

        const price = parseFloat(priceText.replace(/[₦,]/g, ""));
        productData = { name, price, image_url: img };
      }

      // Add to cart
      addToCart(productData);
      
      // Hide loading state
      hideLoading(button);

      // Show success notification
      showNotification(`${productData.name} added to cart!`, 'success');
    }
  });

  function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(item => item.name === product.name);
    
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        name: product.name,
        price: product.price,
        image: product.image_url || product.image,
        quantity: 1
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
  }

  // Modern notification system
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} position-fixed`;
    notification.style.cssText = `
      top: 20px;
      right: 20px;
      z-index: 9999;
      min-width: 300px;
      animation: slideInRight 0.3s ease-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease-in';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
  
  // Add CSS for notifications
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // Function to update cart count in header
  function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.getElementById("cart-count");
    if (cartCount) cartCount.textContent = count;
  }

});
