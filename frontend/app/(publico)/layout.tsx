import '../globals.css';
import BarraNavegacion from '../../components/layout/BarraNavegacion';
import FooterLayout from '../../components/layout/Footer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BarraNavegacion />
      {children}
      <FooterLayout />
    </>
  );
}
