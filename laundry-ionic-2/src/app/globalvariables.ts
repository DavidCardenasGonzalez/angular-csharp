export const globalVars =  {

    BaseURL: "http://localhost:50679", 
    // BaseURL: "http://192.168.0.108:3000",
    // BaseURL: "http://stage.dmenu.co:3005",
    //BaseURL: "http://107.170.45.205:3000",
    LaundryitemsURL: "/api/laundryItem",
    getLaundryitemsApiURL(){
        return ((this.BaseURL + this.LaundryitemsURL) as string);
    },
    laundryURL:"/laundryItems",
    patchLaundryitemsApiURL(orderID){
        return ((this.BaseURL + this.OrderURL + orderID +this.laundryURL) as string);
    },
    PreGenURL: "pregen/order/user/",
    PreGenApiURL(userID){
        return this.BaseURL + this.OrderURL + this.PreGenURL + userID;
    },
    OrderURL: "/api/order/",
    getOrderByIdURL(orderID){
        return this.BaseURL + this.OrderURL + orderID;
    },
    ServicesURL: "/service",
    ServicesApiURL(orderID){
        return this.BaseURL + this.OrderURL + orderID + this.ServicesURL;
    },
    PickupURL: "/pickup",
    patchPickupApiURL(orderID){
        return this.BaseURL + this.OrderURL + orderID + this.PickupURL;
    },
    DropOffURL: "/dropoff",
    patchDropOffApiURL(orderID){
        return this.BaseURL + this.OrderURL + orderID + this.DropOffURL;
    },
    CareInstructionsURL: "/instructions",
    patchCareInstructionsURL(orderID){
        return this.BaseURL + this.OrderURL + orderID + this.CareInstructionsURL;
    },
    AllUsers: "/api/v1/users/",
    SignUp: "/api/account/users2",
    PostNewUser(){
        return ((this.BaseURL + this.SignUp as string));
    },
    UsersURL: 'user/',
    getOrdersHistoryURL(userID: string){
        return this.BaseURL + this.OrderURL + this.UsersURL + userID;
    },
    UsersAddressURL: '/address',
    UserAddress(userID: string){
        return this.BaseURL + this.AllUsers  +  userID + this.UsersAddressURL;
    },
    getUsersAddress(userID: string){
        return this.BaseURL + this.AllUsers  + userID +  '/addresses';
    },
    ComplainUrl:'/complain',
    PatchComplainURL(userID){
        return this.BaseURL + this.AllUsers + '/' + userID + this.ComplainUrl; 
    },
    getComplainsURL(userID){
        return this.BaseURL + this.AllUsers + '/' + userID + this.ComplainUrl + 's';
    },
    NotificationURL: '/notificationSettings',
    NotificationSettingsURL(userID){
        return this.BaseURL + this.AllUsers + '/' + userID + this.NotificationURL;
    },
    SignInURL: '/connect/token',
    PostSignInApi(){
        return (this.BaseURL + this.SignInURL as string);
    },
    forgorPasswordURL: 'password/forgot',
    getForgotPasswordAPIURL(){
        return this.BaseURL + this.AllUsers + this.forgorPasswordURL;
    },
    profileURL: '/api/account/users/',
    profileAPIURL(userID){
        return this.BaseURL + this.profileURL + userID;
        // return this.BaseURL + this.AllUsers + userID + this.profileURL;
    },
    statusURL: 'statuslist',
    statusAPIURL(){
        return this.BaseURL + this.OrderURL + this.statusURL;

    }
}
