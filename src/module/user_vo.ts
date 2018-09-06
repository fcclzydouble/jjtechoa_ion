export class UserInfo {
    username:string;
    userfullname:string;
    password:string;
    userroles:string;
    userdept:string;
    userdeptname:string;
    userstate:number;//0 不在线,1在线

    constructor(
        username:string,
        userfullname:string,
        password:string,
        userroles:string,
        userdept:string,
        userdeptname) {
            this.username = username;
            this.userfullname = userfullname;
            this.password = password;
            this.userroles = userroles;
            this.userdept = userdept;
            this.userdeptname = userdeptname;
            this.userstate = 0;

    }

   

   

}