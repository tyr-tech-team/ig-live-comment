import { InitStatus, Login, Logout, Api } from "./fb-basic-api";

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
    //
  }
  return _res;
};
// --------------------------------------------------------
// 狀態
export const Status = async (appId) => {
  const statusRes = await InitStatus(appId);
  return ResMsg("InitStatus", statusRes);
};
// --------------------------------------------------------
// 授權
export const Authorization = async (appId) => {
  const params = {
    return_scopes: true,
    scope: [
      "pages_manage_cta",
      "pages_show_list",
      "pages_messaging",
      "instagram_basic",
      "pages_read_engagement",
      "business_management",
    ].join(",")
  };
  const statusRes = await InitStatus(appId);
  // 如果狀態失效
  if (statusRes.status !== "connected") {
    const res = await Login(params);
    return ResMsg("Login", res);
  }
  return ResMsg("InitStatus", statusRes);
};
// --------------------------------------------------------
// 釋放
export const Freed = async (appId) => {
  const statusRes = await InitStatus(appId);
  // 如果是有效狀態
  if (statusRes.status === "connected") {
    const res = await Logout();
    return ResMsg("Logout", res);
  }
  return ResMsg("noCheck", statusRes);
};
// --------------------------------------------------------
// 資訊
export const Info = async (appId) => {
  const statusRes = await InitStatus(appId);
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
export const ReAuthorization = async (appId) => {
  await Freed(appId);
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
// -----------
// 取得IG商業帳戶
export const IGBusinessInfo = async (pageId) => {
  const statusRes = await InitStatus();
  if (statusRes.status === "connected") {
    const param = {
      url: `/${pageId}?fields=instagram_business_account`
    };
    const data = {authResponse: null, status: "connected"};
    const res = await Api(param);
    if (res) data.authResponse = res;
    return ResMsg("Api", data);
  }
  return ResMsg("InitStatus", statusRes);
};
// -----------
// 取得IG直播列表
export const IGLiveList = async (pageId) => {
  const statusRes = await InitStatus();
  if (statusRes.status === "connected") {
    const param = {
      url: `/${pageId}/live_media`
    };
    const data = {authResponse: null, status: "connected"};
    const res = await Api(param);
    if (res) data.authResponse = res;
    return ResMsg("Api", data);
  }
  return ResMsg("InitStatus", statusRes);
};
// -----------
// 取得IG直播留言
export const IGLiveComments = async (mediaId) => {
  const statusRes = await InitStatus();
  if (statusRes.status === "connected") {
    const param = {
      url: `/${mediaId}/comments?fields=from,text,timestamp,user,username`
    };
    const data = {authResponse: null, status: "connected"};
    const res = await Api(param);
    if (res) data.authResponse = res;
    return ResMsg("Api", data);
  }
  return ResMsg("InitStatus", statusRes);
};