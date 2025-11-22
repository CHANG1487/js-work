// 通用API宣告
const baseURL = "https://livejs-api.hexschool.io/api/livejs/v1/customer/";
const api_path = "lika";
const productsApiUrl = `${baseURL}${api_path}/products`;
const cartsApiUrl = `${baseURL}${api_path}/carts`;

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
console.log(discardAllBtn);

// 事件監聽
shoppingCartTableBody.addEventListener("click", (e) => {
  e.preventDefault();
  const id = e.target.dataset.id;
  if (id) {
    deleteCart(id);
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

  if (carts.length === 0) {
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
                <td>${item.quantity}</td>
                <td>NT$${item.product.price}</td>
                <td class="discardBtn">
                  <a href="#" class="material-icons" data-id="${item.id}"> clear </a>
                </td>
              </tr>`;
    });
    discardAllBtn.style.display = "inline-block";
  }
  shoppingCartTableBody.innerHTML = cartlist;
  shoppingCartTotal.textContent = `NT$${finalTotal}`;
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
function addCart(id) {
  const data = {
    data: {
      productId: id,
      quantity: 1,
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

function init() {
  getProducts();
  getCartList();
}

init();
