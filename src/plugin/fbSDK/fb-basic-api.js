import "./SDK.js";


export const InitStatus = () =>
  new Promise((resolve) => {
    // window.fbAsyncInit = function() {
    //   window.FB.init({
    //     appId            : "1652952081803511",
    //     autoLogAppEvents : true,
    //     xfbml            : true,
    //     version          : "v16.0"
    //   });
    // };
    window.FB.init({
      appId: "1105528194174599", // appid
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
