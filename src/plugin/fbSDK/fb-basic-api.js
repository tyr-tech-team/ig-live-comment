import "./SDK.js";

export const InitStatus = (appId) =>
  new Promise((resolve) => {
    window.FB.init({
      appId, // appid
      cookie: true,
      xfbml: true,
      version: "v16.0"
    });
    // window.FB.AppEvents.logPageView();
    window.FB.getLoginStatus((res) => resolve(res));
  });
export const Login = (param) =>
  new Promise((resolve) => window.FB.login((res) => resolve(res), param));

export const Logout = () =>
  new Promise((resolve) => window.FB.logout((res) => resolve(res)));

export const Api = (param) =>
  new Promise((resolve) => window.FB.api(param.url, (res) => resolve(res)));
