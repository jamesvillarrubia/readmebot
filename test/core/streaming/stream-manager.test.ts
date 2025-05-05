import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StreamManager, StreamManagerOptions } from '../../../src/core/streaming/stream-manager.js';

describe('StreamManager', () => {
    let manager: StreamManager;
    const defaultOptions: StreamManagerOptions = {
        batchSize: 2,
        batchDelay: 0,
        autoResumeAfterError: true,
        maxRetries: 1
    };

    beforeEach(() => {
        manager = new StreamManager(defaultOptions);
    });

    describe('start', () => {
        it('should process all items in batches', async () => {
            const items = [1, 2, 3, 4, 5];
            const processed: number[] = [];
            const processor = async (item: number) => {
                processed.push(item);
            };

            await manager.start(items, processor);

            expect(processed).toEqual(items);
            expect(manager.getState().isComplete).toBe(true);
            expect(manager.getState().progress.processed).toBe(items.length);
        });

        it('should emit progress events', async () => {
            const items = [1, 2, 3, 4];
            const progressEvents: number[] = [];
            const processor = async () => { };

            manager.on('progress', (progress) => {
                progressEvents.push(progress.processed);
            });

            await manager.start(items, processor);

            expect(progressEvents).toEqual([1, 2, 3, 4]);
        });

        it('should handle errors and retry', async () => {
            const items = [1, 2, 3, 4];
            const processed: number[] = [];
            let failCount = 0;

            const processor = async (item: number) => {
                if (item === 2 && failCount === 0) {
                    failCount++;
                    throw new Error('Test error');
                }
                processed.push(item);
            };

            const errorEvents: Error[] = [];
            manager.on('error', (error) => {
                if (error instanceof Error) {
                    errorEvents.push(error);
                }
            });

            await manager.start(items, processor);

            expect(processed).toEqual(items);
            expect(errorEvents).toHaveLength(1);
            expect(errorEvents[0]?.message).toBe('Test error');
            expect(manager.getState().isComplete).toBe(true);
        });

        it('should not start when already active', async () => {
            const processor = async () => { };
            const promise = manager.start([1], processor);

            await expect(manager.start([2], processor)).rejects.toThrow('Stream is already active');
            await promise;
        });
    });

    describe('pause/resume', () => {
        it('should pause and resume processing', async () => {
            const items = [1, 2, 3, 4];
            const processed: number[] = [];
            let isProcessing = false;

            const processor = async (item: number) => {
                isProcessing = true;
                await new Promise(resolve => setTimeout(resolve, 50));
                processed.push(item);
                isProcessing = false;
            };

            const processPromise = manager.start(items, processor);

            // Wait for processing to start
            while (!isProcessing) {
                await new Promise(resolve => setTimeout(resolve, 10));
            }

            manager.pause();

            // Wait for current item to finish
            while (isProcessing) {
                await new Promise(resolve => setTimeout(resolve, 10));
            }

            const pausedLength = processed.length;
            await new Promise(resolve => setTimeout(resolve, 100));
            expect(processed.length).toBe(pausedLength);

            manager.resume();
            await processPromise;

            expect(processed).toEqual(items);
        });

        it('should throw when pausing inactive stream', () => {
            expect(() => manager.pause()).toThrow('Stream is not active');
        });

        it('should throw when resuming inactive stream', () => {
            expect(() => manager.resume()).toThrow('Stream is not active');
        });
    });

    describe('cancel', () => {
        it('should cancel processing', async () => {
            const items = [1, 2, 3, 4];
            const processed: number[] = [];
            const processor = async (item: number) => {
                processed.push(item);
            };

            const processPromise = manager.start(items, processor);
            manager.cancel();
            await processPromise;

            expect(processed.length).toBeLessThan(items.length);
            expect(manager.getState().isCancelled).toBe(true);
        });

        it('should throw when cancelling inactive stream', () => {
            expect(() => manager.cancel()).toThrow('Stream is not active');
        });
    });

    describe('events', () => {
        it('should emit all events', async () => {
            const items = [1, 2, 3, 4];
            const events: string[] = [];
            const processor = async () => { };

            manager.on('progress', () => events.push('progress'));
            manager.on('pause', () => events.push('pause'));
            manager.on('resume', () => events.push('resume'));
            manager.on('error', () => events.push('error'));
            manager.on('complete', () => events.push('complete'));
            manager.on('cancel', () => events.push('cancel'));

            const processPromise = manager.start(items, processor);
            manager.pause();
            manager.resume();
            manager.cancel();
            await processPromise;

            expect(events).toContain('progress');
            expect(events).toContain('pause');
            expect(events).toContain('resume');
            expect(events).toContain('cancel');
        });
    });
}); 