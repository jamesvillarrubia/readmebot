/**
 * Interface for file system operations
 */
export interface FileSystem {
    /**
     * Read a file's contents
     */
    readFile(path: string): Promise<string>;

    /**
     * Write content to a file
     */
    writeFile(path: string, content: string): Promise<void>;

    /**
     * List directory contents
     */
    readDir(path: string): Promise<string[]>;

    /**
     * Check if a path exists
     */
    exists(path: string): Promise<boolean>;
} 