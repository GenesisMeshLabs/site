'use client';
import { useTranslations } from 'next-intl';
import { buildSignature } from '@/build-signature';

/** Comes from the signer, so the link always points at the file it wrote. */
const SIGNATURE_PATH = buildSignature.path;

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer>
      <span>{t('copyright')}</span>

      <span className="footer-links">
        <a href="https://genesismesh.connectorzzz.com/" target="_blank" rel="noopener noreferrer">
          {t('links.docs')}
        </a>
        <a href="https://dev.connectorzzz.com/" target="_blank" rel="noopener noreferrer">
          {t('links.devHub')}
        </a>
      </span>

      {/* Only claim the builds are signed when this build actually was. */}
      {buildSignature.signed ? (
        <span className="footer-attest">
          {t('signature')}{' '}
          <a href={SIGNATURE_PATH} target="_blank" rel="noopener noreferrer">
            {t('verify')}
          </a>
          <code className="footer-keyid">{buildSignature.keyId}</code>
        </span>
      ) : (
        <span className="footer-attest footer-attest-unsigned">
          <a href={SIGNATURE_PATH} target="_blank" rel="noopener noreferrer">
            {t('unsigned')}
          </a>
        </span>
      )}
    </footer>
  );
}
