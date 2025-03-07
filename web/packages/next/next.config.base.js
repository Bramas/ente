// @ts-check

/**
 * @file Configure the Next.js build
 *
 * This file gets used by the Next.js build phase, and is not included in the
 * browser build. It will not be parsed by Webpack, Babel or TypeScript, so
 * don't use features that will not be available in our target node version.
 *
 * https://nextjs.org/docs/pages/api-reference/next-config-js
 */

const { withSentryConfig } = require("@sentry/nextjs");
const cp = require("child_process");

const gitSHA = process.env.GIT_SHA || cp
    .execSync("git rev-parse --short HEAD", {
        cwd: __dirname,
        encoding: "utf8",
    })
    .trimEnd();

/**
 * The base Next.js config. Before exporting this, we wrap this in
 * {@link withSentryConfig}.
 *
 * @type {import("next").NextConfig}
 */
const nextConfig = {
    /* generate a static export when we run `next build` */
    output: "export",
    compiler: {
        emotion: true,
    },
    transpilePackages: [
        "@/next",
        "@/ui",
        "@/utils",
        "@mui/material",
        "@mui/system",
        "@mui/icons-material",
    ],

    // Add environment variables to the JavaScript bundle. They will be
    // available as `process.env.VAR_NAME` to our code.
    env: {
        GIT_SHA: gitSHA,
    },

    // https://dev.to/marcinwosinek/how-to-add-resolve-fallback-to-webpack-5-in-nextjs-10-i6j
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback.fs = false;
        }
        return config;
    },

    // Build time Sentry configuration
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
    sentry: {
        widenClientFileUpload: true,
        disableServerWebpackPlugin: true,
    },
};

const sentryWebpackPluginOptions = {
    // The same release value needs to be used both:
    // 1. here to create a new release on Sentry and upload sourcemaps to it,
    // 2. and when initializing Sentry in the browser (`Sentry.init`).
    release: gitSHA,
};

// withSentryConfig extends the default Next.js usage of webpack to:
//
// 1. Initialize the SDK on client page load (See `sentry.client.config.ts`)
//
// 2. Upload sourcemaps, using the settings defined in `sentry.properties`.
//
// Sourcemaps are only uploaded to Sentry if SENTRY_AUTH_TOKEN is defined. Note
// that sourcemaps are always generated in the static export; the Sentry Webpack
// plugin behavies as if the `productionBrowserSourceMaps` Next.js configuration
// setting is `true`.
//
// Irritatingly, Sentry insists that we create empty sentry.server.config.ts and
// sentry.edge.config.ts files, even though we are not using those parts.
module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
