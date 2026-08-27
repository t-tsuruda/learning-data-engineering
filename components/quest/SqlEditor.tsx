"use client";

import dynamic from "next/dynamic";
import { loader } from "@monaco-editor/react";

// jsDelivr CDNには依存せず、public/vs（scripts/copy-vendor-assets.mjsでコピー）から
// Monaco自体を自前ホスティングして読み込む。CDNアクセス不可な環境でも動作させるため。
loader.config({ paths: { vs: "/vs" } });

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center rounded-md border border-border bg-bg-elevated text-xs text-text-muted">
      Editorを読み込み中...
    </div>
  ),
});

export function SqlEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-md border border-border-strong">
      <Editor
        height="220px"
        language="sql"
        theme="vs-dark"
        value={value}
        onChange={(v) => onChange(v ?? "")}
        options={{
          fontSize: 13,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: "on",
          padding: { top: 12 },
        }}
      />
    </div>
  );
}
