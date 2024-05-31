/** @type {import('next').NextConfig} */
const nextConfig = {
    // 외부 링크 이미지의 최적화 hostname 설정
    images : {
        remotePatterns : [
            { 
                hostname : "avatars.githubusercontent.com"
            }
        ]
    }
};

export default nextConfig;
