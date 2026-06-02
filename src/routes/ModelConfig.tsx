import { useState } from 'react';
import { ModelConfigCard } from '@/components/common/ModelConfigCard';
import { mockModels } from '@/data/mockModels';
import type { ModelConfig } from '@/types';
import { Server, Plus, Shield } from 'lucide-react';

export function ModelConfig() {
  const [models, setModels] = useState<ModelConfig[]>(mockModels);

  const handleToggle = (id: string) => {
    setModels((prev) =>
      prev.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">模型配置</h1>
          <p className="text-sm text-text-secondary mt-1">
            配置模型供应商和路由规则 · API Key 存储在后端环境变量
          </p>
        </div>
        <button className="btn-primary text-xs flex items-center gap-1.5">
          <Plus size={13} /> 添加模型
        </button>
      </div>

      {/* Security note */}
      <div className="panel-card border-accent-yellow/30 bg-accent-yellow/5">
        <div className="flex items-start gap-3">
          <Shield size={20} className="text-accent-yellow shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-accent-yellow">安全提示</h3>
            <p className="text-xs text-text-secondary mt-1 leading-relaxed">
              API Key <strong>不应在前端代码中明文存储</strong>。
              当前为 UI 占位展示。正式上线时，API Key 必须放在 Cloudflare Workers 环境变量中。
            </p>
          </div>
        </div>
      </div>

      {/* Routing rules */}
      <div className="panel-card">
        <h2 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
          <Server size={16} /> 模型路由规则
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          <RuleRow label="高价值复杂分析" value="GPT / Claude / Gemini" />
          <RuleRow label="大批量低成本分析" value="DeepSeek / Qwen / Kimi" />
          <RuleRow label="中文运营任务" value="DeepSeek / Qwen / Kimi" />
          <RuleRow label="英文 Listing / 广告语" value="GPT / Claude / Gemini" />
          <RuleRow label="多模态图片理解" value="Gemini / GPT" />
          <RuleRow label="强推理和复杂归因" value="Claude / GPT" />
          <RuleRow label="成本控制" value="管理员可为每个 Agent 设定默认模型" />
        </div>
      </div>

      {/* Model cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {models.map((model) => (
          <ModelConfigCard key={model.id} model={model} onToggle={handleToggle} />
        ))}
      </div>

      {/* API interface docs */}
      <div className="panel-card">
        <h2 className="text-sm font-semibold text-text-primary mb-3">统一调用接口</h2>
        <div className="bg-bg-dark rounded-xl p-4 font-mono text-xs text-text-muted overflow-x-auto">
          <p className="text-accent-cyan mb-1">POST /api/ai/run</p>
          <pre className="whitespace-pre-wrap">{`{
  "agentId": "boutique_ops_daily",
  "modelProvider": "datater",
  "modelName": "gpt-4.1",
  "taskType": "daily_scan",
  "inputFiles": [],
  "inputText": "",
  "context": {},
  "options": { "temperature": 0.2, "maxTokens": 8000 }
}`}</pre>
        </div>
      </div>
    </div>
  );
}

function RuleRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 px-3 rounded-lg bg-white/5 border border-white/5">
      <span className="text-text-muted">{label}</span>
      <span className="text-text-primary font-medium">{value}</span>
    </div>
  );
}
