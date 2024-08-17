export const reactStrictMode = false;
// export const output = "export";
export const images = {
  remotePatterns: [
    {
      protocol: "http",
      hostname: "127.0.0.1",
      port: "8000",
      pathname: "**",
    },
    {
      protocol: "http",
      hostname: "192.168.1.3",
      port: "8000",
      pathname: "**",
    },
  ],
};
