import React, { useId } from "react";
import { styles, COLORS } from "../theme";

// ============================================================
// FORM FIELD WRAPPER
// ============================================================
export const FormField = ({ label, htmlFor, children }) => (
  <div>
    <label style={styles.label} htmlFor={htmlFor}>{label}</label>
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
}) => {
  const id = useId();
  const errorId = id + "-error";
  return (
    <FormField label={label} htmlFor={id}>
      <div style={{ position: "relative" }}>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            ...styles.input,
            paddingRight: suffix ? 36 : 9,
            borderColor: error ? COLORS.red : undefined,
          }}
          onFocus={(e) => (e.target.style.borderColor = COLORS.blue)}
          onBlur={(e) => (e.target.style.borderColor = error ? COLORS.red : "#ddd")}
          step={type === "number" ? "any" : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
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
      {error && <div id={errorId} role="alert" style={styles.fehler}>{error}</div>}
    </FormField>
  );
};

// ============================================================
// SELECT INPUT
// ============================================================
export const SelectInput = ({ label, value, onChange, options, error }) => {
  const id = useId();
  return (
    <FormField label={label} htmlFor={id}>
      <select
        id={id}
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
};

// ============================================================
// TOGGLE BUTTON
// ============================================================
export const ToggleButton = ({ label, value, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={value}
    style={styles.toggle(value)}
    onClick={() => onChange(!value)}
  >
    <span style={{ fontSize: 14 }}>{value ? "\u2713" : "\u25CB"}</span>
    {label}
  </button>
);

// ============================================================
// NAVIGATION BUTTONS (Zurück / Weiter)
// ============================================================
export const NavButtons = ({ onPrev, onNext, nextLabel = "Weiter \u2192" }) => (
  <div
    style={{
      display: "flex",
      justifyContent: onPrev ? "space-between" : "flex-end",
      marginTop: 14,
    }}
  >
    {onPrev && (
      <button style={styles.btnOutline} onClick={onPrev}>
        &larr; Zurück
      </button>
    )}
    {onNext && (
      <button style={styles.btnPrimary} onClick={onNext}>
        {nextLabel}
      </button>
    )}
  </div>
);
