import { Password } from '@/models/user';
import { randomBytes, scrypt, timingSafeEqual } from 'crypto';


export class PasswordHasher {
    // OWASP recommended parameters for scrypt
    private static readonly SALT_LENGTH = 32;
    private static readonly KEY_LENGTH = 64;

    /**
     * Generates a cryptographically secure random salt
     */
    public static generateSalt(): string {
        return randomBytes(this.SALT_LENGTH).toString('hex');
    }

    /**
     * Hashes a password with a given salt using scrypt
     */
    public static async hash(safePassword: string, salt: string): Promise<string> {
        return new Promise((resolve, reject) => {
            scrypt(
                safePassword.normalize(),
                salt,
                this.KEY_LENGTH,
                (err, derivedKey) => {
                    if (err) {
                        reject(new Error('Hashing failed'));
                    } else {
                        resolve(derivedKey.toString('hex').normalize());
                    }
                }
            );
        });
    }

    /**
     * Creates a complete hash string containing both salt and hash (format: "salt:hash")
     */
    public static async hashPassword(safePassword: string): Promise<string> {
        const salt = this.generateSalt();
        const hash = await this.hash(safePassword, salt);
        return `${salt}:${hash}`;
    }

    /**
     * Validates a password against a stored hash string (the stored hash should be in the format "salt:hash")
     */
    public static async verify(safePassword: Password, storedHash: string): Promise<boolean> {
        const [salt, hash] = storedHash.split(':');
        const compareHash = await this.hash(safePassword, salt);
        
        // Use timing-safe comparison
        return timingSafeEqual(
            Buffer.from(hash, 'hex'),
            Buffer.from(compareHash, 'hex')
        );
    }
}