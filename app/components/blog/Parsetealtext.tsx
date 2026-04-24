"use client";

import React from "react";

interface ParseteTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Parses text with {{word}} syntax and renders those words in teal (#00BCD4).
 * Example: "How {{AI}} Is Changing" → "How " + <teal>AI</teal> + " Is Changing"
 */
export default function ParseteText({ text, className, style }: ParseteTextProps) {
  const parts = text.split(/(\{\{.*?\}\})/g);

  return (
    <span className={className} style={style}>
      {parts.map((part, i) => {
        if (part.startsWith("{{") && part.endsWith("}}")) {
          const word = part.slice(2, -2);
          return (
            <span key={i} style={{ color: "#00BCD4" }}>
              {word}
            </span>
          );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </span>
  );
}
