import { Location } from "@/models/login.types";

export const getIpLocation = async (ip?: string): Promise<Location | null> => {
    ip = '172.225.41.152'
    if(!ip) return null;
    try{
        const data = await fetch(`http://ip-api.com/json/${ip}`, {
            method: "GET"
        }).then(res => res.json());
        if(data?.status != 'success') return null;
        return ({
            lat: data.lat,
            lon: data.lon,
            city: data?.city,
            country: data?.country
        })
    }catch(err){
        return null;
    }
}