'use client'

import { useState } from 'react'
import EyeIcon from './EyeIcon'
import styles from './sso.module.css'

// A password box with the eye to show what was typed
export default function PasswordInput({
  id,
  value,
  onChange,
  autoComplete,
  placeholder,
  disabled,
}: {
  id: string
  value: string
  onChange: (value: string) => void
  autoComplete: string
  placeholder?: string
  disabled?: boolean
}) {
  const [shown, setShown] = useState(false)
  return (
    <div className={styles.passwordBox}>
      <input
        id={id}
        type={shown ? 'text' : 'password'}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={styles.input}
        placeholder={placeholder}
        required
        disabled={disabled}
      />
      <button
        type="button"
        onClick={() => setShown(!shown)}
        className={styles.showButton}
        aria-label={shown ? 'Hide password' : 'Show password'}
      >
        <EyeIcon shown={shown} />
      </button>
    </div>
  )
}
