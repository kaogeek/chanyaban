import { Router } from '@angular/router'; 
import { FORMAT_DATE } from '../../shares/Constants';

export abstract class AbstractNewTab { 

    protected router: Router;  
    protected FORMAT_DATE: string = FORMAT_DATE; 

    constructor(router: Router) {
        this.router = router;
    } 

    public newTabNewsAgency(newsAgencyName: string): void {
        const url = this.router.serializeUrl(this.router.createUrlTree(["/agency/" + this.encodeURL(newsAgencyName)]));
        window.open(url, '_blank');
    }

    public newTabSourceType(sourceType: string): void {
      const url = this.router.serializeUrl(this.router.createUrlTree(["/channel/"+sourceType]));
      window.open(url, '_blank');
    }

    public encodeURL(param): string {
        if (param.includes("/")) {
            return param = param.replace("/", encodeURIComponent("/"));
        }
        return param;
    }  
}
