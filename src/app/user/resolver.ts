import { Prisma, PrismaClient } from '@prisma/client';
import axios from 'axios';
import { prismaClient } from '../../clients/db';
import JWTService from '../services/jwt';

interface GoogleTokenResult {
    iss?: String,
    nbf?: String,
    aud?: String,
    sub?: String,
    email?: String,
    email_verified?: String,
    azp?: String,
    name?: String,
    picture?: String,
    given_name?: String,
    family_name?: String,
    iat?: String,
    exp?: String,
    jti?: String,
    alg?: String,
    kid?: String,
    typ?: String

}

const queries = {
    verifyGoogleToken: async( parent:any,{token}:{token: string} ) =>{
        
        const googleToken = token;
        const googleOauthURL = new URL('https://oauth2.googleapis.com/tokeninfo');
        googleOauthURL.searchParams.set('id_token', googleToken);

        const { data } = await axios.get<GoogleTokenResult>(googleOauthURL.toString(),{
            responseType: 'json'
        });

        //console.log(data);
        const user = await prismaClient.user.findUnique({
            where: { email: data.email as string }
            
        });
        if(!user){
            await prismaClient.user.create({
                data :{
                    email: data.email as string,
                    FirstName: data.given_name as string,
                    LastName: data.family_name as string,
                    profileImageURL: data.picture as string,
                }
            });
        }  

        const userInDb = await prismaClient.user.findUnique({ where: { email: data.email as string } });
        if (!userInDb) {
            throw new Error("User not found");
        
        }
        const userToken = await JWTService.generateTokenForUser(userInDb);
        return userToken;
        
    },
};
export const resolver = { queries };