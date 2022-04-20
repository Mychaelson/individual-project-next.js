// it will ony allow user that haven't logged in to the web app to access the particular page
const guestOnly = (gssp) => {
  return async (context) => {
    const savedUserData = context.req.cookies.user_data;

    console.log(context.req.cookies.user_data);

    if (savedUserData) {
      return {
        redirect: {
          destination: "/home-page",
        },
      };
    }

    return gssp(context);
  };
};

export default guestOnly;
