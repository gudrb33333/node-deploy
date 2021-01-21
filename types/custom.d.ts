import { } from 'passport';

declare global {
	namespace Express {
        interface Users {
            id?:string;
        }
    }
} 