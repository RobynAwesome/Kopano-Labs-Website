import { motion } from 'framer-motion';

type Signal = 'yes' | 'partial' | 'no' | 'target';

type Product = {
  name: string;
  route: string;
  works: Signal;
  visible: Signal;
  backing: Signal;
  current: Signal;
  backingLabel: string;
};

const products: Product[] = [
  { name: 'FiveS Arena', route: 'https://fivesarena.com', works: 'yes', visible: 'yes', backing: 'yes', current: 'yes', backingLabel: 'Hellenic FC backing' },
  { name: 'KasiLink', route: 'https://kasilink.com', works: 'partial', visible: 'yes', backing: 'target', current: 'partial', backingLabel: 'Government backing target' },
  { name: 'Cape Campus', route: '#', works: 'partial', visible: 'partial', backing: 'target', current: 'partial', backingLabel: 'Tourism backing target' },
  { name: 'Starfall Salvage', route: 'https://starfallsalvage.kopanolabs.com', works: 'partial', visible: 'yes', backing: 'no', current: 'partial', backingLabel: 'Operations rework before investor push' },
  { name: 'Cars4Mars', route: '/Cars4Mars/', works: 'partial', visible: 'yes', backing: 'partial', current: 'yes', backingLabel: 'Competition programme + physical build phase' },
];

const score = (value: Signal) => value === 'yes' ? 2 : value === 'partial' ? 1 : 0;

function classify(product: Product) {
  const evidence = score(product.works) + score(product.visible) + score(product.backing) + score(product.current);
  if (product.backing === 'yes' && product.works === 'yes' && product.visible === 'yes') return ['BACKED', 'validated'];
  if (product.works === 'partial' && product.current === 'partial') return ['REWORK', 'warning'];
  if (product.backing === 'target') return ['NEEDS BACKING', 'target'];
  if (evidence <= 2) return ['FOC RISK', 'risk'];
  return ['BUILDING', 'building'];
}

const focGroups = [
  ['FAKE OF CONCEPT', 'Claim surface outruns current evidence. The fix is not more copy; it is evidence, working state, backing or visible proof.'],
  ['FREEDOM OF CONCEPT', 'Agency is allowed, but freedom is never consequence-free. Actions remain governed by evidence, ownership and downstream effect.'],
] as const;

export function FOCMatrix() {
  return <section className="foc-surface">
    <div className="foc-head">
      <span className="eyebrow">POC ↔ FOC</span>
      <h1>Validate the thing.<br/><em>Then amplify it.</em></h1>
      <p>Working state, visibility, backing and recency are separate signals. No MVP gets promoted by presentation alone.</p>
    </div>

    <div className="foc-groups">
      {focGroups.map(([name, rule], index) => <motion.article key={name} initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:index*.08}}>
        <span>{String(index + 1).padStart(2,'0')}</span><h2>{name}</h2><p>{rule}</p>
      </motion.article>)}
    </div>

    <div className="foc-matrix" role="table" aria-label="Kopano Labs MVP FOC validation matrix">
      <div className="foc-row foc-row-head" role="row"><b>PRODUCT</b><b>WORKS</b><b>VISIBLE</b><b>BACKING</b><b>CURRENT</b><b>STATE</b></div>
      {products.map((product) => {
        const [state, tone] = classify(product);
        return <a key={product.name} className={`foc-row ${tone}`} href={product.route} target={product.route.startsWith('http') ? '_blank' : undefined} rel={product.route.startsWith('http') ? 'noreferrer' : undefined} role="row">
          <div><strong>{product.name}</strong><small>{product.backingLabel}</small></div>
          <i data-signal={product.works}>{product.works}</i>
          <i data-signal={product.visible}>{product.visible}</i>
          <i data-signal={product.backing}>{product.backing}</i>
          <i data-signal={product.current}>{product.current}</i>
          <span>{state}</span>
        </a>;
      })}
    </div>
  </section>;
}
