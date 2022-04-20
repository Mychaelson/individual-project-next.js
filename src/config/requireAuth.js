// // it will ony allow user that have already logged in to the web app to access the particular page
const requiresAuth = (gssp) => {
  return async (context) => {
    const savedUserData = context.req.cookies.auth_token;

    // console.log(context.req.cookies.user_data);

    if (!savedUserData) {
      return {
        redirect: {
          destination: "/",
        },
      };
    }

    return gssp(context);
  };
};

export default requiresAuth;
