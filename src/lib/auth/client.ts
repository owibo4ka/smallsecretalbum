"use client";

import { createAuthClient } from "@neondatabase/auth/next";

// Client-side auth. Talks to our own /api/auth route, so it needs no config.
export const authClient = createAuthClient();
