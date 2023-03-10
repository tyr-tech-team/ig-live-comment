import { InitStatus, Login, Logout, Api } from "./fb-basic-api";
// import { isEmpty } from "@/plugins/utils"
// import store from "@/store";

// const fbRole = "user_gender, email, pages_manage_ads, pages_manage_metadata, pages_read_engagement, pages_show_list, public_profile, pages_messaging";
// const fbItem = "name,id,gender,email,accounts{picture,access_token,id,tasks,name}"

// message
const ResMsg = (fnName, res, closeMask = false) => {
  const _res = {
    data: res.authResponse,
    status: {
      isPass: res.status === "connected" // not_authorized, connected ,unknown
    }
  };
  // // 例外
  if (fnName === "noCheck" && res.status === "unknown") _res.status.isPass = false;
  if (fnName === "Logout") _res.status.isPass = true;
  if (fnName === "Login" && _res.status.isPass === true) {
    // const roles = store.getters.fbRole.replace(/\s+/g, "").split(",");
    // const userPassRoles = _res.data.grantedScopes.replace(/\s+/g, "").split(",");
    // let allpass = true;
    // roles.forEach((role) => {
    //   if (!userPassRoles.find((item) => item === role)) {
    //     // Message.error({
    //     //   content: `${role}粉專帳號權限不足`,
    //     //   duration: 3
    //     // });
    //     allpass = false;
    //   }
    // });
    // if (!allpass) {
    //   await Freed();
    //   _res.status.isPass = 1;
    // }
  }
  return _res;
};
// --------------------------------------------------------
// 狀態
export const Status = async () => {
  const statusRes = await InitStatus();
  return ResMsg("InitStatus", statusRes);
};
// --------------------------------------------------------
// 授權
export const Authorization = async () => {
  const params = {
    return_scopes: true,
    scope: [
      "pages_manage_cta",
      "pages_show_list",
      "pages_messaging",
      "instagram_basic",
      "pages_read_engagement",
      "instagram_shopping_tag_products",
    ].join(",")
  };
  console.log(params);
  const statusRes = await InitStatus();
  // 如果狀態失效
  if (statusRes.status !== "connected") {
    const res = await Login(params);
    return ResMsg("Login", res);
  }
  return ResMsg("InitStatus", statusRes);
};
// --------------------------------------------------------
// 釋放
export const Freed = async () => {
  const statusRes = await InitStatus();
  // 如果是有效狀態
  if (statusRes.status === "connected") {
    const res = await Logout();
    return ResMsg("Logout", res);
  }
  return ResMsg("noCheck", statusRes);
};
// --------------------------------------------------------
// 資訊
export const Info = async () => {
  const statusRes = await InitStatus();
  if (statusRes.status === "connected") {
    const param = {
      url: "/me?fields=id,first_name,last_name,middle_name,name,name_format,picture,email,short_name" // 索取欄位  public_profile：id,first_name,last_name,middle_name,name,name_format,picture,email,short_name
    };
    const data = { authResponse: null, status: "connected" };
    const res = await Api(param);
    if (res) data.authResponse = res;
    return ResMsg("Api", data);
  }
  return ResMsg("InitStatus", statusRes);
};
// --------------------------------------------------------
// 重新授權
export const ReAuthorization = async () => {
  await Freed();
  const res = await Authorization();
  return res;
};
// --------------------------------------------------------
// 取得粉專列表
export const FbPageList = async () => {
  const statusRes = await InitStatus();
  if (statusRes.status === "connected") {
    const param = {
      url: "/me/accounts"
    };
    const data = {authResponse: null, status: "connected"};
    const res = await Api(param);
    if (res) data.authResponse = res;
    return ResMsg("Api", data);
  }
  return ResMsg("InitStatus", statusRes);
};

