/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/@:login',
                destination: '/profile/:login',
            },
        ];
    },
};


export default nextConfig;
