type RoverVisualProps = { className?: string };

const wheels = [
  [78, 220, .62], [196, 220, .62], [314, 220, .62],
  [88, 229, 1], [206, 229, 1], [324, 229, 1],
] as const;

export function RoverVisual({ className }: RoverVisualProps) {
  return <svg viewBox="0 0 410 285" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-labelledby="rover-title rover-description">
    <title id="rover-title">Kopano Labs six-wheel rover design schematic</title>
    <desc id="rover-description">Six-wheel rocker-bogie rover concept with low battery bay, payload tray, camera and LiDAR mast.</desc>
    <defs>
      <linearGradient id="rover-body" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#152033"/><stop offset="55%" stopColor="#293950"/><stop offset="100%" stopColor="#121a29"/></linearGradient>
      <linearGradient id="mars-glow" x1="0%" y1="100%" x2="0%" y2="0%"><stop offset="0%" stopColor="#ff6b00" stopOpacity=".38"/><stop offset="100%" stopColor="#ff6b00" stopOpacity="0"/></linearGradient>
      <filter id="schematic-glow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <ellipse cx="205" cy="258" rx="157" ry="18" fill="url(#mars-glow)"/>
    <g stroke="#4f8dff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity=".82"><path d="M88 205 L146 175 L206 211"/><path d="M206 211 L264 175 L324 205"/><path d="M146 175 L264 175"/><path d="M196 205 L206 176"/></g>
    {wheels.map(([cx,cy,opacity],index)=><g key={`${cx}-${cy}`} opacity={opacity}><circle cx={cx} cy={cy} r="27" fill="#070b12" stroke={index<3?'#244571':'#0066ff'} strokeWidth="1.5"/><circle cx={cx} cy={cy} r="17" fill="#172238" stroke="#55708e"/><path d={`M ${cx-10} ${cy} H ${cx+10} M ${cx} ${cy-10} V ${cy+10}`} stroke="#4f8dff" strokeWidth=".8" opacity=".75"/></g>)}
    <path d="M70 151 H337 L321 201 H87 Z" fill="url(#rover-body)" stroke="#0066ff" strokeWidth="1.4" filter="url(#schematic-glow)"/>
    <rect x="104" y="166" width="128" height="24" rx="4" fill="#07101f" stroke="#ff6b00"/><text x="118" y="182" fill="#ffad6e" fontSize="9" fontFamily="monospace">24 V LiFePO4 · LOW BAY</text>
    <path d="M116 128 H294 V155 H116 Z" fill="#1b273a" stroke="#8494a8"/><path d="M135 127 V112 H275 V127" stroke="#ff8b39" strokeWidth="2"/><text x="158" y="105" fill="#ffad6e" fontSize="9" fontFamily="monospace">1 KG PAYLOAD TRAY</text>
    <rect x="193" y="64" width="24" height="65" rx="3" fill="#182438" stroke="#4f8dff"/><ellipse cx="205" cy="56" rx="34" ry="8" fill="#0b111d" stroke="#4f8dff" strokeWidth="1.3"/><rect x="169" y="72" width="72" height="23" rx="5" fill="#0b111d" stroke="#0066ff" strokeWidth="1.2"/><circle cx="187" cy="83.5" r="4" fill="#55a5ff"/><circle cx="223" cy="83.5" r="4" fill="#55a5ff"/><rect x="198" y="79" width="14" height="9" rx="2" fill="#ff8b39"/>
    <g stroke="#0066ff" opacity=".48" strokeDasharray="4 5"><path d="M48 44 H362"/><path d="M48 264 H362"/><path d="M48 44 V264"/><path d="M362 44 V264"/></g>
    <text x="172" y="278" fill="#72a7ff" fontSize="10" fontFamily="monospace">700 mm TARGET LENGTH</text>
  </svg>;
}
