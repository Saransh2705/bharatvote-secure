import type { Server } from "http";

import app from "./app";
import { verifySupabaseConnection, env, log, initializeResend } from "./config";

const port = Number(env.port ?? 3000);

let server: Server | undefined;

const startServer = async () => {
    const supabaseHost = (() => {
        try {
            return new URL(env.supabaseUrl).host;
        } catch (error) {
            log.warning("Unable to parse Supabase URL");
            return "unknown";
        }
    })();

    log.header("SERVER STARTUP");
    log.database(`Environment loaded - Supabase host: ${supabaseHost}`);

    // Initialize Resend client
    log.info("Initializing Resend email client...");
    try {
        initializeResend();
    } catch (error) {
        log.warning("Resend initialization failed - email notifications will not work");
    }

    const supabaseReady = await verifySupabaseConnection();
    if (!supabaseReady) {
        log.error("Supabase connectivity check failed; aborting startup");
        process.exit(1);
    }
    log.success("Supabase connectivity verified");

    server = app.listen(port, () => {
        log.api(`Express server running on http://localhost:${port}`);
    });

    log.success("Server startup complete!");
    log.header("");
};

startServer().catch((error) => {
    log.error(`Server startup failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
});

// Prevent crashes from unhandled errors
process.on("uncaughtException", (error) => {
    log.error(`Uncaught Exception: ${error.message}`);
    log.warning("Server continues running despite the error");
});

process.on("unhandledRejection", (reason, promise) => {
    log.error(`Unhandled Rejection: ${reason}`);
    log.warning("Server continues running despite the error");
});

process.on("SIGINT", () => {
    if (!server) {
        process.exit(0);
        return;
    }
    server.close(() => {
        log.info("Express server closed");
        process.exit(0);
    });
});
