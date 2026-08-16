type Signal = 'yes' | 'partial' | 'no' | 'target';

type Product = {
  name: string;
  route: string;
  works: Signal;
  visible: Signal;
  backing: Signal;
  current: Signal;
  connected: Signal;
  backingLabel: string;
};

const products: Product[] = [
  { name: 'FiveS Arena', route: 'https://fivesarena.com', works: 'yes', visible: 'yes', backing: 'yes', current: 'yes', connected: 'yes', backingLabel: 'Hellenic FC backing' },
  { name: 'KasiLink', route: 'https://kasilink.com', works: 'partial', visible: 'yes', backing: 'target', current: 'partial', connected: 'partial', backingLabel: 'Government backing target' },
  { name: 'Cape Campus', route: '#', works: 'partial', visible: 'partial', backing: 'target', current: 'partial', connected: 'target', backingLabel: 'Tourism backing target' },
  { name: 'Starfall Salvage', route: 'https://starfallsalvage.kopanolabs.com', works: 'partial', visible: 'yes', backing: 'no', current: 'partial', connected: 'yes', backingLabel: 'Operations rework before investor push' },
  { name: 'Cars4Mars', route: '/Cars4Mars/', works: 'partial', visible: 'yes', backing: 'partial', current: 'yes', connected: 'yes', backingLabel: 'Competition programme + physical build phase' },
];

const score = (value: Signal) => value === 'yes' ? 2 : value === 'partial' ? 1 : 0;

function classify(product: Product) {
  const evidence = score(product.works) + score(product.visible) + score(product.backing) + score(product.current) + score(product.connected);
  if (product.backing === 'yes' && product.works === 'yes' && product.visible === 'yes') return ['BACKED', 'validated'];
  if (product.works === 'partial' && product.current === 'partial') return ['REWORK', 'warning'];
  if (product.backing === 'target') return ['NEEDS BACKING', 'target'];
  if (evidence <= 2) return ['FOC RISK', 'risk'];
  return ['BUILDING', 'building'];
}

const reviewContract = [
  ['01', 'WORKS', 'The user can complete a meaningful first move.'],
  ['02', 'VISIBLE', 'The public can inspect the current state and artifact.'],
  ['03', 'BACKED', 'An owner, source or next physical gate is named.'],
] as const;

export function FOCMatrix() {
  return <section className="foc-surface">
    <div className="foc-head">
      <span className="eyebrow">FOC · EVIDENCE GATE</span>
      <h1>Make the state legible.<br/><em>Then make the claim.</em></h1>
      <p>This is one review contract for public work. It is not a group directory, a popularity score or proof by presentation alone.</p>
    </div>

    <div className="foc-contract-strip" aria-label="FOC review contract">
      {reviewContract.map(([index, label, detail]) => <article key={label}><span>{index}</span><strong>{label}</strong><p>{detail}</p></article>)}
    </div>

    <div className="foc-matrix" role="table" aria-label="Kopano Labs evidence gate matrix">
      <div className="foc-row foc-row-head" role="row"><b>PRODUCT</b><b>WORKS</b><b>VISIBLE</b><b>BACKING</b><b>CURRENT</b><b>CONNECTED</b><b>STATE</b></div>
      {products.map((product) => {
        const [state, tone] = classify(product);
        return <a key={product.name} className={'foc-row ' + tone} href={product.route} target={product.route.startsWith('http') ? '_blank' : undefined} rel={product.route.startsWith('http') ? 'noreferrer' : undefined} role="row">
          <div><strong>{product.name}</strong><small>{product.backingLabel}</small></div>
          <i data-signal={product.works}>{product.works}</i>
          <i data-signal={product.visible}>{product.visible}</i>
          <i data-signal={product.backing}>{product.backing}</i>
          <i data-signal={product.current}>{product.current}</i>
          <i data-signal={product.connected}>{product.connected}</i>
          <span>{state}</span>
        </a>;
      })}
    </div>
  </section>;
}
