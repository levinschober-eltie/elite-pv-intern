import React from "react";
import { styles, COLORS } from "../theme";

// ============================================================
// FORM FIELD WRAPPER
// ============================================================
export const FormField = ({ label, children }) => (
  <div>
    <label style={styles.label}>{label}</label>
    {children}
  </div>
);

// ============================================================
// TEXT / NUMBER INPUT
// ============================================================
export const TextInput = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  suffix,
  error,
  ...rest
}) => (
  <FormField label={label}>
    <div style={{ position: "relative" }}>
      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(
            type === "number"
              ? e.target.value === ""
                ? ""
                : +e.target.value
              : e.target.value
          )
        }
        placeholder={placeholder}
        style={{
          ...styles.input,
          paddingRight: suffix ? 36 : 9,
          borderColor: error ? COLORS.red : undefined,
        }}
        onFocus={(e) => (e.target.style.borderColor = COLORS.blue)}
        onBlur={(e) => (e.target.style.borderColor = error ? COLORS.red : "#ddd")}
        step={type === "number" ? "any" : undefined}
        {...rest}
      />
      {suffix && (
        <span
          style={{
            position: "absolute",
            right: 7,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 10.5,
            color: COLORS.mid,
          }}
        >
          {suffix}
        </span>
      )}
    </div>
    {error && <div style={styles.fehler}>{error}</div>}
  </FormField>
);

// ============================================================
// SELECT INPUT
// ============================================================
export const SelectInput = ({ label, value, onChange, options }) => (
  <FormField label={label}>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={styles.select}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </FormField>
);

// ============================================================
// TOGGLE BUTTON
// ============================================================
export const ToggleButton = ({ label, value, onChange }) => (
  <div style={styles.toggle(value)} onClick={() => onChange(!value)}>
    <span style={{ fontSize: 14 }}>{value ? "✓" : "○"}</span>
    {label}
  </div>
);

// ============================================================
// NAVIGATION BUTTONS (Zurück / Weiter)
// ============================================================
export const NavButtons = ({ onPrev, onNext, nextLabel = "Weiter →" }) => (
  <div
    style={{
      display: "flex",
      justifyContent: onPrev ? "space-between" : "flex-end",
      marginTop: 14,
    }}
  >
    {onPrev && (
      <button style={styles.btnOutline} onClick={onPrev}>
        ← Zurück
      </button>
    )}
    {onNext && (
      <button style={styles.btnPrimary} onClick={onNext}>
        {nextLabel}
      </button>
    )}
  </div>
);
