import React, { useRef, useEffect } from "react";
import SignaturePadLib from "signature_pad";
import { styles, COLORS } from "../theme";
import { TextInput } from "./FormFields";

// ============================================================
// SIGNATURE PAD – Canvas-basierte Unterschrift
// ============================================================
export default function SignaturePad({
  label,
  name,
  onNameChange,
  date,
  onDateChange,
  signatureData,
  onSignatureChange,
}) {
  const canvasRef = useRef(null);
  const padRef = useRef(null);

  // Initialize SignaturePad on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const pad = new SignaturePadLib(canvas, {
      backgroundColor: "rgba(250, 250, 250, 0)",
    });
    padRef.current = pad;

    // On stroke end -> emit base64 PNG
    pad.addEventListener("endStroke", () => {
      if (onSignatureChange) {
        onSignatureChange(pad.toDataURL("image/png"));
      }
    });

    // ResizeObserver to keep canvas dimensions in sync
    const resizeCanvas = () => {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      const ctx = canvas.getContext("2d");
      ctx.scale(ratio, ratio);
      // Restore existing data after resize
      if (!pad.isEmpty()) {
        const data = pad.toData();
        pad.clear();
        pad.fromData(data);
      }
    };

    const observer = new ResizeObserver(() => {
      resizeCanvas();
    });
    observer.observe(canvas);

    // Initial sizing
    resizeCanvas();

    return () => {
      observer.disconnect();
      pad.off();
    };
  }, []);

  // Restore signature data when prop changes
  useEffect(() => {
    const pad = padRef.current;
    if (!pad) return;

    if (signatureData) {
      pad.fromDataURL(signatureData);
    } else {
      pad.clear();
    }
  }, [signatureData]);

  const handleClear = () => {
    if (padRef.current) {
      padRef.current.clear();
    }
    if (onSignatureChange) {
      onSignatureChange(null);
    }
  };

  return (
    <div
      style={{
        border: "1.5px solid #dde8f0",
        padding: 16,
        borderRadius: 8,
        background: "#fff",
      }}
    >
      {/* Label */}
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: COLORS.mid,
          textTransform: "uppercase",
          letterSpacing: 0.4,
          marginBottom: 6,
        }}
      >
        {label}
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: 150,
          border: "1px solid #dde8f0",
          borderRadius: 6,
          background: "#FAFAFA",
          cursor: "crosshair",
          display: "block",
          touchAction: "none",
        }}
      />

      {/* Clear button */}
      <div style={{ display: "flex", marginTop: 8 }}>
        <button
          type="button"
          onClick={handleClear}
          style={{
            ...styles.btnOutline,
            fontSize: 11,
            padding: "4px 12px",
          }}
        >
          Löschen
        </button>
      </div>

      {/* Name + Datum */}
      <div style={{ ...styles.grid2, marginTop: 10 }}>
        <TextInput
          label="Name"
          value={name}
          onChange={onNameChange}
          placeholder="Vor- und Nachname"
        />
        <TextInput
          label="Datum"
          value={date}
          onChange={onDateChange}
          placeholder="TT.MM.JJJJ"
        />
      </div>
    </div>
  );
}
