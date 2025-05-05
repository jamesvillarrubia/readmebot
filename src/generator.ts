import FileOperations from './generator/fileOperations.js';
import AIOperations from './generator/aiOperations.js';
import SummaryManager from './generator/summaryManager.js';

export class Generator {
  private summaryManager: SummaryManager;

  constructor (options?: any) {
    this.summaryManager = new SummaryManager({
        ...options,
        fileOps: new FileOperations(),
        aiOps: new AIOperations(),
        force: options?.force ?? false,
        minPrependLines: options?.minPrependLines ?? 10
    });
  }

  public async run (): Promise<void> {
    await this.summaryManager.run();
  }
}

export default Generator;