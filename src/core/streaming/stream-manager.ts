import { EventEmitter } from 'events';

/**
 * Progress information for streaming operations
 */
export interface StreamProgress {
    /** Total number of items to process */
    total: number;
    /** Number of items processed */
    processed: number;
    /** Current operation description */
    operation: string;
    /** Optional error information */
    error?: Error;
}

/**
 * Stream state for managing streaming operations
 */
export interface StreamState {
    /** Whether the stream is active */
    isActive: boolean;
    /** Whether the stream is paused */
    isPaused: boolean;
    /** Whether the stream has completed */
    isComplete: boolean;
    /** Whether the stream was cancelled */
    isCancelled: boolean;
    /** Current progress information */
    progress: StreamProgress;
}

/**
 * Options for stream manager
 */
export interface StreamManagerOptions {
    /** Batch size for processing items */
    batchSize?: number;
    /** Delay between batches in milliseconds */
    batchDelay?: number;
    /** Whether to auto-resume after error */
    autoResumeAfterError?: boolean;
    /** Maximum number of retry attempts */
    maxRetries?: number;
}

/**
 * Manager for handling streaming operations
 */
export class StreamManager extends EventEmitter {
    private state: StreamState;
    private options: Required<StreamManagerOptions>;
    private retryCount: number;

    constructor(options?: StreamManagerOptions) {
        super();
        this.options = {
            batchSize: 10,
            batchDelay: 100,
            autoResumeAfterError: true,
            maxRetries: 3,
            ...options
        };
        this.state = {
            isActive: false,
            isPaused: false,
            isComplete: false,
            isCancelled: false,
            progress: {
                total: 0,
                processed: 0,
                operation: 'Initializing'
            }
        };
        this.retryCount = 0;
    }

    /**
     * Start streaming operation
     */
    async start<T>(
        items: T[],
        processor: (item: T) => Promise<void>,
        operation = 'Processing'
    ): Promise<void> {
        if (this.state.isActive) {
            throw new Error('Stream is already active');
        }

        this.state = {
            isActive: true,
            isPaused: false,
            isComplete: false,
            isCancelled: false,
            progress: {
                total: items.length,
                processed: 0,
                operation
            }
        };
        this.retryCount = 0;

        try {
            for (let i = 0; i < items.length;) {
                if (this.state.isCancelled) {
                    break;
                }

                while (this.state.isPaused) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }

                const item = items[i];
                if (item === undefined) {
                    i++;
                    continue;
                }

                try {
                    await processor(item);
                    this.state.progress.processed++;
                    this.emit('progress', this.state.progress);
                    i++;
                } catch (error) {
                    if (error instanceof Error) {
                        this.state.progress.error = error;
                        this.emit('error', error);

                        if (this.options.autoResumeAfterError && this.retryCount < this.options.maxRetries) {
                            this.retryCount++;
                            continue;
                        }
                        throw error;
                    }
                    throw error;
                }

                if (i < items.length) {
                    await new Promise(resolve => setTimeout(resolve, this.options.batchDelay));
                }
            }

            this.state.isComplete = true;
            this.emit('complete', this.state.progress);
        } finally {
            this.state.isActive = false;
        }
    }

    /**
     * Pause streaming operation
     */
    pause(): void {
        if (!this.state.isActive) {
            throw new Error('Stream is not active');
        }
        this.state.isPaused = true;
        this.emit('pause', this.state.progress);
    }

    /**
     * Resume streaming operation
     */
    resume(): void {
        if (!this.state.isActive) {
            throw new Error('Stream is not active');
        }
        this.state.isPaused = false;
        this.emit('resume', this.state.progress);
    }

    /**
     * Cancel streaming operation
     */
    cancel(): void {
        if (!this.state.isActive) {
            throw new Error('Stream is not active');
        }
        this.state.isCancelled = true;
        this.emit('cancel', this.state.progress);
    }

    /**
     * Get current stream state
     */
    getState(): StreamState {
        return { ...this.state };
    }
} 