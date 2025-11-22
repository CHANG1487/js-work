// 通用API宣告
const baseURL = "https://livejs-api.hexschool.io/api/livejs/v1/customer/";
const api_path = "lika";
const productsApiUrl = `${baseURL}${api_path}/products`;
const cartsApiUrl = `${baseURL}${api_path}/carts`;
const ordersApiUrl = `${baseURL}${api_path}/orders`;

let products = [];
let carts = [];
let finalTotal = 0;

const productWrap = document.querySelector(".productWrap");
const productSelect = document.querySelector(".productSelect");
const shoppingCartTableBody = document.querySelector(
  ".shoppingCart-table tbody"
);
const shoppingCartTotal = document.querySelector(".total");
const discardAllBtn = document.querySelector(".discardAllBtn");
const orderInfoBtn = document.querySelector(".orderInfo-btn");
const customerName = document.querySelector("#customerName");
const customerPhone = document.querySelector("#customerPhone");
const customerEmail = document.querySelector("#customerEmail");
const customerAddress = document.querySelector("#customerAddress");
const orderInfoForm = document.querySelector(".orderInfo-form");
const tradeWay = document.querySelector("#tradeWay");

// 事件監聽
shoppingCartTableBody.addEventListener("click", (e) => {
  e.preventDefault();
  const target = e.target;
  const id = target.dataset.id;

  if (!id) {
    return;
  } else if (target.classList.contains("discardSingleBtn")) {
    deleteCart(id);
    return;
  } else if (target.classList.contains("cartQtyPlus")) {
    updateCartQty(id, "plus");
    return;
  } else if (target.classList.contains("cartQtyMinus")) {
    updateCartQty(id, "minus");
    return;
  }
});

discardAllBtn.addEventListener("click", (e) => {
  e.preventDefault();
  deleteCarts();
});

productWrap.addEventListener("click", (e) => {
  e.preventDefault();
  const id = e.target.dataset.id;
  if (id) {
    addCart(id);
  }
});

orderInfoBtn.addEventListener("click", (e) => {
  e.preventDefault();

  customerName.nextElementSibling.style.display = "none";
  customerPhone.nextElementSibling.style.display = "none";
  customerEmail.nextElementSibling.style.display = "none";
  customerAddress.nextElementSibling.style.display = "none";

  const name = customerName.value.trim();
  const tel = customerPhone.value.trim();
  const email = customerEmail.value.trim();
  const address = customerAddress.value.trim();
  const payment = tradeWay.value;

  let isError = false;
  if (!name) {
    customerName.nextElementSibling.style.display = "block";
    isError = true;
  }
  if (!tel) {
    customerPhone.nextElementSibling.style.display = "block";
    isError = true;
  }
  if (!email) {
    customerEmail.nextElementSibling.style.display = "block";
    isError = true;
  }
  if (!address) {
    customerAddress.nextElementSibling.style.display = "block";
    isError = true;
  }
  if (!isError) {
    const formData = {
      data: {
        user: {
          name,
          tel,
          email,
          address,
          payment,
        },
      },
    };
    submitOrder(formData);
  }
});

// 篩選產品
productSelect.addEventListener("change", function () {
  if (productSelect.value === "全部") {
    rendorProducts(products);
  } else {
    let filterProducts = [];
    products.forEach((product) => {
      if (product.category === productSelect.value) {
        filterProducts.push(product);
      }
    });
    rendorProducts(filterProducts);
  }
});

// 渲染購物車列表
function rendorCarts() {
  let cartlist = "";

  if (!carts.length) {
    cartlist = `<tr>
        <td colspan="5" style="text-align:center;">
          目前購物車內沒有商品
        </td>
      </tr>`;
    discardAllBtn.style.display = "none";
  } else {
    carts.forEach((item) => {
      cartlist += `<tr>
                <td>
                  <div class="cardItem-title">
                    <img src="${item.product.images}" alt="${item.product.title}" />
                    <p>${item.product.title}</p>
                  </div>
                </td>
                <td>NT$${item.product.origin_price}</td>
                <td class="cartQtyCell">
                  <div class="cartQtyGroup">
                    <span class="material-symbols-outlined cartQtyMinus" data-id="${item.id}">remove</span>
                    <span class="cartQty">${item.quantity}</span>
                    <span class="material-symbols-outlined cartQtyPlus" data-id="${item.id}">add</span>
                  </div>
                </td>
                <td>NT$${item.product.price}</td>
                <td class="discardBtn">
                  <a href="#" class="material-icons discardSingleBtn" data-id="${item.id}"> clear </a>
                </td>
              </tr>`;
    });
    discardAllBtn.style.display = "inline-block";
  }
  shoppingCartTableBody.innerHTML = cartlist;
  shoppingCartTotal.textContent = `NT$${finalTotal}`;

  if (!carts.length) {
    orderInfoBtn.setAttribute("disabled", true);
    orderInfoBtn.value = "請先加入商品";
  } else {
    orderInfoBtn.removeAttribute("disabled");
    orderInfoBtn.value = "送出預訂資料";
  }
}

// 渲染產品列表
function rendorProducts(data) {
  let productList = "";
  data.forEach((product) => {
    productList += `<li class="productCard">
          <h4 class="productType">新品</h4>
          <img
            src="${product.images}"
            alt="${product.title}"
          />
          <a href="#" class="addCardBtn" data-id="${product.id}">加入購物車</a>
          <h3>${product.title}</h3>
          <del class="originPrice">NT$${product.origin_price}</del>
          <p class="nowPrice">NT$${product.price}</p>
        </li>`;
  });
  productWrap.innerHTML = productList;
}

// 取得產品列表
function getProducts() {
  axios
    .get(productsApiUrl)
    .then((res) => {
      products = res.data.products;
      rendorProducts(products);
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    });
}

// 取得購物車列表
function getCartList() {
  axios
    .get(cartsApiUrl)
    .then((res) => {
      carts = res.data.carts;
      finalTotal = res.data.finalTotal;
      rendorCarts();
    })
    .catch((error) => {
      console.log("取得購物車失敗：", error.response?.data || error);
    });
}

// 加入購物車
function addCart(productId) {
  const sameProduct = carts.find((item) => item.product.id === productId);

  let newQty = 1;
  if (sameProduct) {
    newQty = sameProduct.quantity + 1;
  }

  const data = {
    data: {
      productId: productId,
      quantity: newQty,
    },
  };

  axios
    .post(cartsApiUrl, data)
    .then((res) => {
      carts = res.data.carts;
      finalTotal = res.data.finalTotal;
      rendorCarts();
    })
    .catch((error) => {
      console.log("加入購物車失敗：", error.response?.data || error);
    });
}

// 刪除購物車所有品項
function deleteCarts() {
  axios
    .delete(cartsApiUrl)
    .then((res) => {
      carts = res.data.carts;
      finalTotal = res.data.finalTotal;
      rendorCarts();
    })
    .catch((error) => {
      console.log("刪除購物車失敗：", error.response?.data || error);
    });
}

// 刪除購物車單一品項
function deleteCart(id) {
  axios
    .delete(`${cartsApiUrl}/${id}`)
    .then((res) => {
      carts = res.data.carts;
      finalTotal = res.data.finalTotal;
      rendorCarts();
    })
    .catch((error) => {
      console.log("刪除單一產品失敗：", error.response?.data || error);
    });
}
function updateCartQty(id, type) {
  const targetItem = carts.find((item) => item.id === id);
  if (!targetItem) return;

  let newQty = targetItem.quantity;

  if (type === "plus") {
    newQty += 1;
  } else if (type === "minus") {
    newQty -= 1;
  }

  if (newQty <= 0) {
    deleteCart(id);
    return;
  }

  axios
    .patch(cartsApiUrl, {
      data: {
        id,
        quantity: newQty,
      },
    })
    .then((res) => {
      carts = res.data.carts;
      finalTotal = res.data.finalTotal;
      rendorCarts();
    })
    .catch((error) => {
      console.log("更新購物車數量失敗：", error.response?.data || error);
    });
}

// 送出訂單
function submitOrder(formData) {
  axios
    .post(ordersApiUrl, formData)
    .then((res) => {
      Swal.fire({
        title: "已送出訂單！",
        icon: "success",
        draggable: true,
      });
      orderInfoForm.reset();
      getCartList();
    })
    .catch((error) => {
      console.log("更新表單失敗：", error.response?.data || error);
    });
}

// 預設值
function init() {
  getProducts();
  getCartList();
}

init();
