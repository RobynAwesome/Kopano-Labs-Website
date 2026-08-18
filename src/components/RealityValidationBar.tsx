const receipts = [
  {
    state: 'LIVE CLIENT SYSTEM',
    title: "Five's Arena × Hellenic FC",
    detail: 'Booking, competitions and venue operations in a real Cape Town football environment.',
    href: 'https://fivesarena.com',
  },
  {
    state: 'FIELD CLIENT',
    title: 'North West · 10-acre lucerne farm',
    detail: 'Frost, irrigation, livestock and water-security decisions governed by operational thresholds.',
    href: '/FOC/#field-validation',
  },
  {
    state: 'COMPLETED EXTERNAL WORK',
    title: 'Flow Inc Ink',
    detail: 'Delivered digital work for an operating Midrand tattoo and piercing business.',
    href: '/FOC/#field-validation',
  },
  {
    state: 'ACTIVE DEVELOPMENT',
    title: 'UCT PhD engagement',
    detail: 'Hands-on development engagement; client status remains bounded until a delivery receipt exists.',
    href: '/FOC/#field-validation',
  },
] as const;

export function RealityValidationBar() {
  return <aside className="reality-validation-bar" aria-label="Kopano Labs real-world validation">
    <div className="reality-validation-label">
      <span>REALITY &gt; INDEX</span>
      <strong>Field validation is already happening.</strong>
      <a href="/FOC/#field-validation">Open the evidence ledger →</a>
    </div>
    <div className="reality-validation-track">
      {receipts.map((receipt) => <a key={receipt.title} className="reality-validation-item" href={receipt.href} target={receipt.href.startsWith('http') ? '_blank' : undefined} rel={receipt.href.startsWith('http') ? 'noreferrer' : undefined}>
        <span>{receipt.state}</span>
        <strong>{receipt.title}</strong>
        <small>{receipt.detail}</small>
      </a>)}
    </div>
  </aside>;
}
