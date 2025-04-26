
import Navbar from './navbar';
import FirstTop from './firstTop';
import './globals.css';


export const metadata = {
  title: 'NoteBeats',
  description: 'Music and notes app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <div className="pt-16">
          {children}
        </div>
        <div>
      {/* Other components */}
      <FirstTop />
      {/* Other components */}
    </div>
      </body>
    </html>
  );
}



