/** Full-screen network map — hide site chrome like abb-bank.az/filiallar */
export default function ServiceNetworkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`
        body > div > div > header,
        body > div > div > footer {
          display: none !important;
        }
        body > div > div > main {
          padding: 0 !important;
          margin: 0 !important;
        }
      `}</style>
      {children}
    </>
  );
}
