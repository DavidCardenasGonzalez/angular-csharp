import { Injectable } from '@angular/core';
import { Http, 
         RequestOptions, 
         Headers 
        } from '@angular/http';        

@Injectable()
export class ProfileService{
    constructor(private http: Http){}

    getProfile(URL: string, token: string){
        // var token = 'CfDJ8B_zRzp6sABCto93quNm2FF8-ryfPSfaZeOHMsjCWMMHfocQbLyH372ZEd-nl0EnKay1c5doP91NCGO-1gN3j05UcWx1OGFXIEU_hlYnkZ6Gc7YblpM9lJmcrlD8Aaf6-42CJzOx6qq7q6XzFxHhHNFYAvAtuhML7yLqvVzXKUVvi4dB99oMgGJUpccSeABfZePZTdU04WyFS20_JWujzY3rLs_JveuNWa5teJQOP8kyhFmawCBIrSr6zmSe98jw05knF9QLVsT9dbPFhdqrUSwj2qyuiMXY7g-PdkGf-9FF8wQ5Sp28kDUsHFScJ2jm1yQXCNuFt3MGokMnc_402p6hpkkOvLfXewqTV_kkxekdc9LYAgOtaEc-i7dzwjNHQWj-Z4MImiGFuLw5Hz9FTP-tBUV2sh1R_4LaT25wITR89mF2jG3WhxEv6NnD9ZuM0UvcqzB_fEB6opvhmtGi4LK-oepbSVuMJj-ZjCZRZu-I1iGfpOQBc-rShHKZpjBLD2V1JbYqjpyg2ellj3QVlGm8dGkFZajMzCbkbH2g1sdrZAYoxcnHzTwHpeAaKIp9sYNhWcDgPEQjEK3GIlWsVovtCWrFQNho66VRSCeruw8Br57KIad4iGdD1s3NHaJIgoxeOaUnzWjL_y8w6E9scKwIFa_6Cnxwnk8VZBc0valxP1I9o7kHxKP_RdCZPjVXSGMSlK5JIqHJPLY_tI0002u6zBO9HzN0ZGXIZdgLaUV-KJyMg85Ve-N9HqFevXJPu0ABwvyZ-6njkn3tlOFjMOGNmu2AeghjsZanIN1F7kveMq4OWjRsGDqqo7XhCk_QGWKIWnILlrG6XtqhcDAOBlJwyGha4AeA8wcvLkxh3SoD'
        let headers = new Headers({ 'Authorization': 'Bearer ' + token});
        let options = new RequestOptions({ headers: headers});
        return this.http.get(URL, options)
    }

    putProfile(URL: string, body: any, token: string){
        let headers = new Headers({ 'Authorization': 'Bearer ' + token});
        let options = new RequestOptions({ headers: headers});
        return this.http.put(URL, body, options);
    }
}