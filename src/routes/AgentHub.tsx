import { useState } from 'react';
import { AgentCard } from '@/components/common/AgentCard';
import { mockAgents } from '@/data/mockAgents';
import { Bot, Zap, Search } from 'lucide-react';
import { runAgentTask } from '@/lib/aiRouter';
import type { AiRunResponse } from '@/types';

export function AgentHub() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<AiRunResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const filtered = search
    ? mockAgents.filter((a) => a.name.includes(search) || a.description.includes(search) || a.category.includes(search))
    : mockAgents;

  const handleDispatch = async (agentId: string, modelProvider: string, modelName: string) => {
    setLoading(true);
    setResults(null);
    const res = await runAgentTask({
      agentId,
      modelProvider,
      modelName,
      taskType: 'manual_dispatch',
      inputFiles: [],
      inputText: '',
      context: {},
      options: { temperature: 0.2, maxTokens: 8000 },
    });
    setResults(res);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Agent 路由</h1>
        <p className="text-sm text-text-secondary mt-1">
          统一 Agent Hub · 跳转官网 / API 调用 / 混合模式
        </p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 panel-card">
        <Search size={16} className="text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索 Agent 名称 / 分类 / 描述..."
          className="bg-transparent border-none outline-none text-sm text-text-primary placeholder:text-text-muted flex-1"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="panel-card border-accent-cyan/30 bg-accent-cyan/5 flex items-center gap-3">
          <Zap size={18} className="text-accent-cyan animate-pulse" />
          <span className="text-sm text-accent-cyan">模型处理中...</span>
        </div>
      )}

      {/* Result */}
      {results && (
        <div className="panel-card border-accent-green/30 bg-accent-green/5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-accent-green flex items-center gap-2">
              <Bot size={16} /> 任务已下发
            </h3>
            <span className="text-xs text-text-muted">模型: {results.modelProvider} / {results.modelName}</span>
          </div>
          <p className="text-sm text-text-secondary">{results.result.summary as string}</p>
          <div className="flex gap-4 mt-2 text-xs text-text-muted">
            <span>Tokens: {results.cost.tokens.toLocaleString()}</span>
            <span>预估成本: ${results.cost.estimatedUsd}</span>
            {results.warnings.length > 0 && (
              <span className="text-accent-yellow">⚠ {results.warnings[0]}</span>
            )}
          </div>
        </div>
      )}

      {/* Agent grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((agent) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            onToggle={(id) => console.log('toggle', id)}
            onDispatch={(id) => handleDispatch(id, agent.modelProvider, agent.modelName)}
          />
        ))}
      </div>
    </div>
  );
}
