import { z } from 'zod';

/**
 * Callback type for file system events
 */
export type FileChangeCallback = (event: 'change' | 'delete', path: string) => void;

/**
 * Schema for file metadata
 */
export const FileMetadataSchema = z.object({
    size: z.number(),
    lastModified: z.number(),
    isDirectory: z.boolean(),
    isFile: z.boolean(),
});

export type FileMetadata = z.infer<typeof FileMetadataSchema>;

/**
 * Schema for file read options
 */
export const ReadOptionsSchema = z.object({
    encoding: z.enum(['utf8', 'binary']).optional(),
    flag: z.string().optional(),
});

export type ReadOptions = z.infer<typeof ReadOptionsSchema>;

/**
 * Schema for file write options
 */
export const WriteOptionsSchema = z.object({
    encoding: z.enum(['utf8', 'binary']).optional(),
    flag: z.string().optional(),
    mode: z.number().optional(),
});

export type WriteOptions = z.infer<typeof WriteOptionsSchema>;

/**
 * Interface for file system operations
 */
export interface FileSystem {
    /**
     * Reads the contents of a file
     * @param path - Path to the file
     * @param options - Read options
     * @returns Promise resolving to the file contents
     */
    read(path: string, options?: ReadOptions): Promise<string>;

    /**
     * Writes content to a file
     * @param path - Path to the file
     * @param content - Content to write
     * @param options - Write options
     * @returns Promise that resolves when the write is complete
     */
    write(path: string, content: string, options?: WriteOptions): Promise<void>;

    /**
     * Watches a file or directory for changes
     * @param path - Path to watch
     * @param callback - Function to call when changes occur
     * @returns Function to stop watching
     */
    watch(path: string, callback: FileChangeCallback): () => void;

    /**
     * Checks if a path exists
     * @param path - Path to check
     * @returns Promise resolving to true if the path exists
     */
    exists(path: string): Promise<boolean>;

    /**
     * Gets metadata for a file or directory
     * @param path - Path to get metadata for
     * @returns Promise resolving to file metadata
     */
    stat(path: string): Promise<FileMetadata>;

    /**
     * Lists contents of a directory
     * @param path - Path to directory
     * @returns Promise resolving to array of entry names
     */
    readdir(path: string): Promise<string[]>;
} 