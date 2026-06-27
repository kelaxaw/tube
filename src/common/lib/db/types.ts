type AnalyzeHistoryResponse = {
  watchTime: WatchTime;
  topChannels: Channel[];
  topCategories: Category[];
  insight: Insight;
};

export interface HistoryRepository {
  save: (data: AnalyzeHistoryResponse) => void;
  getById: (id: string) => void;
  getAll: () => void;
  delete: (id: string) => void;
}
