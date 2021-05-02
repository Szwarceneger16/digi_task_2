import { toogleViewsAnimation } from "../toogleViewsAnimation.js";

// ====== INIT TOGGLE VIEW
const createQueryViewElement = document.getElementById("create-query-view");
const storeView = document.getElementById("store-view");
const toggleQueryStoreViews = toogleViewsAnimation(
  createQueryViewElement,
  storeView,
  "toggleQueryStoreAniamtion"
);

document.getElementById("toogle-view-button").addEventListener(
  "click",
  async (e) => {
    e.target.setAttribute("disabled", "");
    toggleQueryStoreViews().then(() => e.target.removeAttribute("disabled"));
  },
  false
);

export { toggleQueryStoreViews };
