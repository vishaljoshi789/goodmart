export const reactStrictMode = false;
// export const output = "export";
export const optimizeFonts = false;
export const experimental = {
  missingSuspenseWithCSRBailout: false,
};
export const images = {
  remotePatterns: [
    {
      protocol: "http",
      hostname: "127.0.0.1",
      port: "8000",
      pathname: "**",
    },
    {
      protocol: "https",
      hostname: "api.goodmart.in",
      pathname: "**",
    },
    {
      protocol: "http",
      hostname: "0.0.0.0",
      port: "8000",
      pathname: "**",
    },
  ],
};
