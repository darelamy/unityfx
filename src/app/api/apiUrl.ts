enum apiUrls {
  production = "https://unityfx.vercel.app",
  development = "http://localhost:3000",
}

export const apiUrl = apiUrls[process.env.NODE_ENV as keyof typeof apiUrls];
