import { LEGAL_VERSIONS, formatLegalDate } from '@/data/legalCopy';

export function LegalVersions() {
  const rows = [
    { label: 'App Version', version: LEGAL_VERSIONS.app, date: null },
    { label: 'Terms of Service', version: `v${LEGAL_VERSIONS.terms.version}`, date: LEGAL_VERSIONS.terms.effectiveDate },
    { label: 'Privacy Policy', version: `v${LEGAL_VERSIONS.privacy.version}`, date: LEGAL_VERSIONS.privacy.effectiveDate },
    { label: 'Disclaimer', version: `v${LEGAL_VERSIONS.disclaimer.version}`, date: LEGAL_VERSIONS.disclaimer.effectiveDate },
  ];

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/50">
            <th className="text-left px-3 py-2 text-muted-foreground font-medium">Document</th>
            <th className="text-left px-3 py-2 text-muted-foreground font-medium">Version</th>
            <th className="text-left px-3 py-2 text-muted-foreground font-medium">Effective</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-t border-border">
              <td className="px-3 py-2 text-foreground">{row.label}</td>
              <td className="px-3 py-2 text-muted-foreground font-mono text-xs">{row.version}</td>
              <td className="px-3 py-2 text-muted-foreground text-xs">{row.date ? formatLegalDate(row.date) : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
