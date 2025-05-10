import { PasswordHasher } from "@/lib/auth/password-hasher";
import { camelToSnakeCase } from "@/lib/utils";
import { User } from "@/models/user";
import { Pool } from "pg";

export class UserDataAccess {
    private static pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    });

    static async createUser(safeUserData: { firstName: string;
        lastName: string;
        email: string;
        password: string;}): Promise<{ success: boolean; user?: User; error?: string }> {
        try {
            // Check if user with email already exists
            const existingUser = await this.getUserByEmail(safeUserData.email);
            if (existingUser.success) {
                return {
                    success: false,
                    error: 'Email already registered'
                };
            }
            // Hash password
            const hash = await PasswordHasher.hashPassword(safeUserData.password);

            // Insert new user
            const query = 'INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5) RETURNING *';
            const values = [safeUserData.email, hash, safeUserData.firstName, safeUserData.lastName, 'USER'];
            const result = await this.pool.query(query, values);

            if (result.rows.length === 0) {
                return {
                    success: false,
                    error: 'Failed to execute query to create user'
                };
            }

            return {
                success: true,
                user: result.rows[0]
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Database error occurred'
            };
        }
    }

    static async getUserById(safeId: number): Promise<{ success: boolean; user?: User; error?: string }> {
        try {
            const query = 'SELECT * FROM users WHERE id = $1';
            const result = await this.pool.query(query, [safeId]);
            
            if (result.rows.length === 0) {
                return {
                    success: false,
                    error: 'User not found'
                };
            }

            return {
                success: true,
                user: result.rows[0]
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Database error occurred'
            };
        }
    }

    static async getUserByEmail(safeEmail: string): Promise<{ success: boolean; user?: User & {passwordHash: string; createdAt: string; updatedAt: string; }; error?: string }> {
        try {
            const query = 'SELECT *, password_hash AS "passwordHash", created_at AS "createdAt", updated_at AS "updatedAt" FROM users WHERE email = $1';
            const result = await this.pool.query(query, [safeEmail]);
            
            if (result.rows.length === 0) {
                return {
                    success: false,
                    error: 'User not found'
                };
            }

            return {
                success: true,
                user: result.rows[0]
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Database error occurred'
            };
        }
    }

    static async updateUser(safeId: string, updates: Partial<User>): Promise<{ success: boolean; user?: User; error?: string }> {
        try {
            const keys = Object.keys(updates);
            const values = Object.values(updates);
            const setClauses = keys.map((key, index) => `${camelToSnakeCase(key)} = $${index + 2}`).join(', ');
            const query = `UPDATE users SET ${setClauses} WHERE id = $1 RETURNING *`;
            // console.log('Query:', query);
            // console.log('Values:', [safeId, ...values]);
            const result = await this.pool.query(query, [safeId, ...values]);
            if (result.rows.length === 0) {
                return {
                    success: false,
                    error: 'User not found'
                };
            }

            return {
                success: true,
                user: result.rows[0]
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Database error occurred'
            };
        }
    }

    static async deleteUser(safeId: string): Promise<{ success: boolean; error?: string }> {
        try {
            const query = 'DELETE FROM users WHERE id = $1';
            const result = await this.pool.query(query, [safeId]);

            if (result.rowCount === 0) {
                return {
                    success: false,
                    error: 'User not found'
                };
            }

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

    static async getAllUsers(): Promise<{ success: boolean; users?: (User & { createdAt: Date, updatedAt: Date })[]; error?: string }> {
        try {
            const query = 'SELECT id, email, first_name AS "firstName", last_name AS "lastName", role, created_at AS "createdAt", updated_at AS "updatedAt" FROM users';
            const result = await this.pool.query(query);
            // console.log(result.rows);
            return {
                success: true,
                users: result.rows.map((user) => ({
                    ...user,
                    createdAt: new Date(user.createdAt),
                    updatedAt: new Date(user.updatedAt)
                }))
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Database error occurred'
            };
        }
    }
}