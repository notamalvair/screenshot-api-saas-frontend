import React, { useState } from 'react';
import { 
  Key, 
  Trash2, 
  Copy, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  Plus, 
  PlusCircle,
  AlertOctagon,
  FileText
} from 'lucide-react';
import { LanguageCode, translations } from '../utils/translations';
import { ApiKey } from '../types';

interface ApiKeysProps {
  apiKeys: ApiKey[];
  onCreateKey: (name: string) => void;
  onRevokeKey: (id: string) => void;
  lang: LanguageCode;
}

export default function ApiKeys({ apiKeys, onCreateKey, onRevokeKey, lang }: ApiKeysProps) {
  const t = translations[lang];

  // Forms and actions states
  const [keyName, setKeyName] = useState('');
  const [showKeyId, setShowKeyId] = useState<string | null>(null);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [errorWord, setErrorWord] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) {
      setErrorWord(t.keyNameRequired);
      return;
    }
    onCreateKey(keyName.trim());
    setKeyName('');
    setShowCreateForm(false);
    setErrorWord('');
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const toggleShowKey = (id: string) => {
    setShowKeyId(showKeyId === id ? null : id);
  };

  return (
    <div id="api-keys-panel-view" className="space-y-8 animate-fade-in">
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-sans font-bold text-white tracking-tight flex items-center gap-2">
            {t.apiKeysTitle} <span className="text-xs font-mono font-normal bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">SHA-256</span>
          </h2>
          <p className="text-sm text-zinc-400 mt-1">{t.apiKeysDesc}</p>
        </div>
        
        {!showCreateForm && (
          <button
            id="open-create-key-form-btn"
            onClick={() => setShowCreateForm(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/10"
          >
            <Plus className="w-4 h-4 text-white" /> {t.createKeyBtn}
          </button>
        )}
      </div>

      {/* Inline Create Form Drawer */}
      {showCreateForm && (
        <form onSubmit={handleCreate} id="api-key-generation-form" className="bg-[#18181b] border border-[#27272a] rounded-3xl p-6 max-w-xl animate-slide-in space-y-4">
          <div className="flex items-center gap-2 text-zinc-200 font-semibold text-sm mb-2">
            <PlusCircle className="w-5 h-5 text-indigo-400" />
            <span>Generate Programmatic Credential Token</span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{t.keyNameLabel}</label>
            <input
              type="text"
              id="new-key-name-field"
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              placeholder={t.keyNamePlaceholder}
              className="w-full bg-[#09090b] text-white border border-[#27272a] focus:border-indigo-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
            {errorWord && <p className="text-xs text-rose-450">{errorWord}</p>}
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={() => {
                setShowCreateForm(false);
                setErrorWord('');
              }}
              className="px-4 py-2 text-xs text-zinc-400 hover:text-white bg-[#09090b] border border-[#27272a] rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-generate-token-btn"
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors"
            >
              {t.createKeyBtn}
            </button>
          </div>
        </form>
      )}

      {/* Main Keys Catalog */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-[#27272a] bg-[#09090b]/45 text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
                <th className="p-4 pl-6">{t.tableKeyName}</th>
                <th className="p-4">{t.tableKeyValue}</th>
                <th className="p-4">{t.tableKeyCreated}</th>
                <th className="p-4">{t.tableKeyUsage}</th>
                <th className="p-4">{t.tableKeyStatus}</th>
                <th className="p-4 pr-6 text-right">{t.tableKeyActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a]/80 text-sm">
              {apiKeys.map((item) => {
                const isRevealed = showKeyId === item.id;
                const isCopied = copiedKeyId === item.id;
                const isRevoked = item.status === 'revoked';

                return (
                  <tr key={item.id} className="hover:bg-[#09090b]/40 transition-colors">
                    <td className="p-4 pl-6 font-semibold text-zinc-200">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-zinc-500" />
                        <span>{item.name}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-xs">
                      <div className="flex items-center gap-3">
                        <span id={`key-span-${item.id}`} className={isRevoked ? 'text-zinc-650 line-through' : 'text-zinc-300'}>
                          {isRevealed 
                            ? item.key 
                            : `${item.key.slice(0, 12)}••••••••••••••••••••`}
                        </span>
                        {!isRevoked && (
                          <div className="flex items-center gap-1.5">
                            <button
                              id={`toggle-reveal-${item.id}`}
                              onClick={() => toggleShowKey(item.id)}
                              className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-[#09090b] transition-colors"
                              title="Toggle Reveal visibility"
                            >
                              {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              id={`copy-token-${item.id}`}
                              onClick={() => copyToClipboard(item.id, item.key)}
                              className="text-zinc-400 hover:text-indigo-400 p-1 rounded-lg hover:bg-[#09090b] transition-colors relative"
                              title="Copy token secret"
                            >
                              {isCopied ? <CheckCircle className="w-3.5 h-3.5 text-indigo-400 animate-scale-up" /> : <Copy className="w-3.5 h-3.5" />}
                              {isCopied && (
                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#09090b] border border-[#27272a] text-white rounded text-[9px] px-1.5 py-0.5 whitespace-nowrap z-50">
                                  {t.copiedMsg}
                                </span>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-xs text-zinc-400 font-mono">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-xs font-mono">
                      <div className="flex flex-col gap-1 w-28">
                        <div className="flex justify-between text-[10px] text-zinc-500">
                          <span>{item.usageCount}</span>
                          <span>/{item.usageLimit}</span>
                        </div>
                        <div className="w-full bg-[#09090b] rounded-full h-1 overflow-hidden border border-[#27272a]">
                          <div 
                            className={`h-full ${isRevoked ? 'bg-zinc-700' : 'bg-indigo-500'}`}
                            style={{ width: `${(item.usageCount / item.usageLimit) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        item.status === 'active'
                          ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20'
                          : 'bg-rose-500/5 text-rose-400 border-rose-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'active' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                        {item.status === 'active' ? t.statusActive : t.statusRevoked}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      {item.status === 'active' ? (
                        <button
                          id={`revoke-token-${item.id}`}
                          onClick={() => onRevokeKey(item.id)}
                          className="text-xs text-rose-450 hover:text-rose-350 hover:bg-rose-500/5 border border-rose-950/20 px-2.5 py-1 rounded-lg transition-all"
                        >
                          {t.actionRevoke}
                        </button>
                      ) : (
                        <span className="text-xs text-zinc-600 font-mono">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {apiKeys.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-zinc-500 text-xs">
                    <AlertOctagon className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
                    <p>{t.noKeysMsg}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
