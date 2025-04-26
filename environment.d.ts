declare global {
    namespace NodeJS {
        interface ProcessEnv {
        NODE_ENV: 'development' | 'production' ;
        BUCKET_NAME: string;
        REGION: string;
        ACCESS_KEY_ID: string;
        SECRET_ACCESS_KEY: string;
        }
    }
}

export {} ;

