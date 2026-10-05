document.addEventListener("DOMContentLoaded", function () {

  const SUPABASE_URL = "https://sgovqqhfybklveexbplu.supabase.co";
  const SUPABASE_KEY = "sb_publishable_tlUHIaL9XlHnWhhQC1Re2A_xM_eu7QS";

  const productsBox = document.getElementById("products");

  const products = [
    {
      id: 1,
      name: "پیراهن کلاسیک مشکی",
      price: 18500000,
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=700&q=85"
    },
    {
      id: 2,
      name: "کت اسپرت مشکی",
      price: 32000000,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=85"
    },
    {
      id: 3,
      name: "شلوار پارچه‌ای",
      price: 16500000,
      image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=700&q=85"
    },
    {
      id: 4,
      name: "هودی اورسایز",
      price: 14500000,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=700&q=85"
    },
    {
      id: 5,
      name: "تیشرت Premium",
      price: 9500000,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=85"
    },
    {
      id: 6,
      name: "کتانی VARENO",
      price: 28500000,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85"
    }
  ];

  let cart = [];


  /* محصولات */

  productsBox.innerHTML = products.map(function (product) {

    return `
      <div class="card">

        <img src="${product.image}" alt="${product.name}">

        <div class="info">

          <h3>${product.name}</h3>

          <div>
            <b>${product.price.toLocaleString("fa-IR")} ریال</b>

            <button onclick="addToCart(${product.id})">
              افزودن
            </button>
          </div>

        </div>

      </div>
    `;

  }).join("");


  /* افزودن به سبد */

  window.addToCart = function (id) {

    const product = products.find(function (item) {
      return item.id === id;
    });

    if (!product) return;

    cart.push(product);

    document.getElementById("cartCount").textContent =
      cart.length;

  };


  /* سبد خرید */

  window.openCart = function () {

    const items = document.getElementById("cartItems");

    if (cart.length === 0) {

      items.innerHTML = "<p>سبد خرید خالی است.</p>";

    } else {

      items.innerHTML = cart.map(function (item) {

        return `
          <p>
            ${item.name}
            — ${item.price.toLocaleString("fa-IR")} ریال
          </p>
        `;

      }).join("");

    }

    const total = cart.reduce(function (sum, item) {
      return sum + item.price;
    }, 0);

    document.getElementById("total").textContent =
      total.toLocaleString("fa-IR");

    document.getElementById("cart").classList.add("show");

  };


  window.closeCart = function () {

    document.getElementById("cart")
      .classList.remove("show");

  };


  /* فرم سفارش */

  window.order = function () {

    if (cart.length === 0) {

      alert("سبد خرید خالی است.");
      return;

    }

    closeCart();

    document.getElementById("orderBox")
      .classList.add("show");

  };


  window.closeOrder = function () {

    document.getElementById("orderBox")
      .classList.remove("show");

  };


  /* ثبت سفارش */

  window.submitOrder = async function () {

    const customerName =
      document.getElementById("name").value.trim();

    const phone =
      document.getElementById("phone").value.trim();

    const province =
  document.getElementById("province").value.trim();
    
    const postalCode =
 document.getElementById("postal_code").value.trim();

    const address =
      document.getElementById("address").value.trim();

    const shipping =
      document.getElementById("shipping").value;


    if (!customerName || !phone || !province || !city || !address) {

      alert("لطفاً همه اطلاعات را کامل کنید.");
      return;

    }


    if (cart.length === 0) {

      alert("سبد خرید خالی است.");
      return;

    }


    if (!window.supabase) {

      alert("کتابخانه Supabase در HTML پیدا نشد.");
      return;

    }


    const supabaseClient =
      window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
      );


    const total =
      cart.reduce(function (sum, item) {
        return sum + item.price;
      }, 0);


    const orderNumber =
      "VAR-" +
      Math.floor(100000 + Math.random() * 900000);


    const { error } =
      await supabaseClient
        .from("orders")
        .insert({

          order_number: orderNumber,

          customer_name: customerName,

          phone: phone,

          province: province,
          
          city: city,
          
          postal_code: postalCode,

          address: address,

          shipping_method: shipping,

          subtotal: total,

          shipping_cost: 0,

          total: total,

          status: "new",

          items: cart

        });


    if (error) {

      console.error(error);

      alert(
        "ثبت سفارش انجام نشد.\n\n" +
        error.message
      );

      return;

    }


    alert(
      "سفارش با موفقیت ثبت شد 🎉\n\n" +
      "شماره سفارش: " +
      orderNumber
    );


    cart = [];

    document.getElementById("cartCount")
      .textContent = "0";

    closeOrder();

  };

});