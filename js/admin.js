// C3.js
let chart = c3.generate({
  bindto: "#chart", // HTML 元素綁定
  data: {
    type: "pie",
    columns: [
      ["Louvre 雙人床架", 1],
      ["Antony 雙人床架", 2],
      ["Anty 雙人床架", 3],
      ["其他", 4],
    ],
    colors: {
      "Louvre 雙人床架": "#DACBFF",
      "Antony 雙人床架": "#9D7FEA",
      "Anty 雙人床架": "#5434A7",
      其他: "#301E5F",
    },
  },
});

// 通用API宣告
const baseURL = "https://livejs-api.hexschool.io/api/livejs/v1/admin/";
const api_path = "lika";
const uid = "ZsML6kZBERadue8i0gsQqFdVjXu2";
const config = {
  headers: {
    authorization: uid,
  },
};

const ordersApiUrl = `${baseURL}${api_path}/orders`;

const orderPageTableBody = document.querySelector(".orderPage-table tbody");

let orders = [];

// 渲染訂單列表
function rendorOrders() {
  let orderList = "";
  orders.forEach((item) => {
    let productStr = "";
    item.products.forEach((p) => {
      productStr += `<p>${p.title} × ${p.quantity}</p>`;
    });

    orderList += `<tr>
            <td>${item.id}</td>
            <td>
              <p>${item.user.name}</p>
              <p>${item.user.tel}</p>
            </td>
            <td>${item.user.address}</td>
            <td>${item.user.address}</td>
            <td>${productStr}</td>
            <td>${new Date(item.createdAt * 1000).toLocaleDateString()}</td>
            <td class="orderStatus">
              <a href="#">${item.paid ? "已處理" : "未處理"}</a>
            </td>
            <td>
              <input type="button" class="delSingleOrder-Btn" value="刪除" data-id="${
                item.id
              }"/>
            </td>
          </tr>`;
  });
  orderPageTableBody.innerHTML = orderList;
}

// 取得訂單
function getOrders() {
  axios
    .get(ordersApiUrl, config)
    .then((res) => {
      orders = res.data.orders;
      rendorOrders();
    })
    .catch((error) => {
      console.log("取得訂單失敗：", error.response?.data || error);
    });
}
getOrders();
