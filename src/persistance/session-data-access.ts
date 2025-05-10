import { Cookies, UserSession } from "@/models/session";
import { randomBytes } from "crypto";
import { Pool } from "pg";

export class SessionDataAccess {
    private static pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    });

    private static readonly COOKIE_SESSION_NAME = 'session-id';
    private static readonly SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 * 7; // 7 days
    private static readonly SESSION_EXPIRATION_MS = this.SESSION_EXPIRATION_SECONDS * 1000;
    private static readonly SESSION_EXPIRATION_DATE = new Date(Date.now() + this.SESSION_EXPIRATION_MS);

    static async createUserSession(safeUserData: { id: string; user_agent: string | null; ip_address?: string | null; }, cookies: Cookies): Promise<{ success: boolean; session?: UserSession; error?: string }> {
        try {
            // Generate a random session token
            const sessionToken = randomBytes(512).toString('hex').normalize();

            // store the session in the database
            const query = 'INSERT INTO sessions (session_token, user_id, expires_at, user_agent, ip_address) VALUES ($1, $2, $3, $4, $5) RETURNING session_token, user_id, created_at AS "createdAt", expires_at AS "expiresAt", user_agent AS "userAgent", ip_address AS "ipAddress"';
            const values = [sessionToken, safeUserData.id, this.SESSION_EXPIRATION_DATE, safeUserData.user_agent, safeUserData.ip_address];
            const result = await this.pool.query(query, values);

            if (result.rows.length === 0) {
                return {
                    success: false,
                    error: 'Failed to create session'
                };
            }

            // Set the session token in the cookies
            this.setCookie(sessionToken, cookies);

            return {
                success: true,
                session: result.rows[0]
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Database error occurred'
            };
        }
    }

    static async getUserSessionByToken(safeSessionToken: string): Promise<{ success: boolean; session?: UserSession; error?: string }> {
        try {
            const query = 'SELECT session_token, user_id as "userId", created_at AS "createdAt", expires_at AS "expiresAt", user_agent AS "userAgent", ip_address AS "ipAddress" FROM sessions WHERE session_token = $1';
            const result = await this.pool.query(query, [safeSessionToken]);
            
            if (result.rows.length === 0) {
                return {
                    success: false,
                    error: 'Session not found'
                };
            }

            return {
                success: true,
                session: result.rows[0]
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Database error occurred'
            };
        }
    }

    static async deleteUserSession(cookies: Pick<Cookies, 'get' | 'delete'>): Promise<{ success: boolean; error?: string }> {
        try {
            const safeSessionToken = cookies.get(this.COOKIE_SESSION_NAME)?.value;

            if (!safeSessionToken) {
                return {
                    success: false,
                    error: 'Session token not found'
                };
            }

            // Delete the session from the database
            const query = 'DELETE FROM sessions WHERE session_token = $1';
            const result = await this.pool.query(query, [safeSessionToken]);

            if (result.rowCount === 0) {
                return {
                    success: false,
                    error: 'Session not found'
                };
            }

            // Clear the session cookie
            cookies.delete(this.COOKIE_SESSION_NAME);
            
            console.log(`Session with token ${safeSessionToken} deleted successfully.`);

            return {
                success: true
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Database error occurred'
            };
        }
    }

    static async getAllUserSessions(): Promise<{ success: boolean; sessions?: (UserSession)[]; error?: string }> {
        try {
            const query = 'SELECT session_token, user_id, created_at AS "createdAt", expires_at AS "expiresAt", user_agent AS "userAgent", ip_address AS "ipAddress" FROM sessions';
            const result = await this.pool.query(query);
            // console.log(result.rows);
            return {
                success: true,
                sessions: result.rows.map((session) => ({
                    ...session,
                    createdAt: new Date(session.createdAt),
                    expiresAt: new Date(session.expiresAt)
                }))
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Database error occurred'
            };
        }
    }

    static async setCookie(safeSessionToken: string, cookies: Pick<Cookies, 'set'>): Promise<void> {
        cookies.set(this.COOKIE_SESSION_NAME, safeSessionToken, {
            secure: true,
            httpOnly: true,
            sameSite: 'lax',
            expires: Date.now() + this.SESSION_EXPIRATION_MS,
        });
    }
}