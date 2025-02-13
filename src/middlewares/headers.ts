import { NextFunction, Request, Response } from "express";
import { UAParser } from 'ua-parser-js'

export const extractHeaders = ({ device = false, authorization = false }) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if(device) req.device = extractDeviceHeaders(req);
        if(authorization) req.authorization = extractAuthorizationHeader(req);
        next();
    }
}

const extractAuthorizationHeader = (req: Request): Authorization => {
    const header = req.get('Authorization');
    const accessToken = header && header.startsWith("Bearer ") ? header.split(' ')[1] : undefined;
    return ({ access_token: accessToken });
}

const extractDeviceHeaders = (req: Request): Device => {
    const userAgent = req.get('User-Agent') ?? 'not-provided';
    const ip = req.ip;
    const parser = new UAParser(userAgent);
    const device = parser.getDevice();
    return ({ user_agent: userAgent, type: device.type, vendor: device.vendor, model: device.model, ip });
}