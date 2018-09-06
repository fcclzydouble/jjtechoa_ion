export class AppFunction {
    public id : string;
    public name : string;
    public psource :string;
  
    constructor(public tid : string, public tname : string,public tpsource :string) {
      this.id = tid;
      this.name = tname;
      this.psource = tpsource;
    }
  
    public getId() : string {
      return this.id;
    }
    public setId(tid : string){
      this.id = tid;
    }
  
    public getName() : string {
      return this.name;
    }
    public setName(tname : string){
      this.name = tname;
    }
  
    public getPsource() : string {
      return this.psource;
    }
    public setPsource(tpsource : string){
      this.psource = tpsource;
    }
  
    
  
  
  }