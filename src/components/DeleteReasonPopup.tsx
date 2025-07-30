import React from 'react'

interface DeleteReasonPopupProps {
  visible: boolean
  reason: string
  setReason: (value: string) => void
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteReasonPopup({
  visible,
  reason,
  setReason,
  onConfirm,
  onCancel,
}: DeleteReasonPopupProps) {
  if (!visible) return null

  return (
    <div className='delete-popup-overlay'>
      <div className='delete-popup'>
        <h3>Why do you want to delete this order?</h3>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          maxLength={500}
          placeholder='Describe your reason (max 500 characters)'
        />
        <div className='popup-actions'>
          <button onClick={onCancel}>Cancel</button>
          <button
            onClick={() => {
              if (reason.trim()) {
                onConfirm()
              }
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
